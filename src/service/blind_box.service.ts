import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { BlindBox } from '../entity/blind_box.entity';
import { BlindBoxItem } from '../entity/blind_box_item.entity';
import { UserOrder } from '../entity/user_order.entity';
import { User } from '../entity/user.entity';
import { CreateBlindBoxDTO, UpdateBlindBoxDTO, UpdateBlindBoxItemDTO, ApiResponse } from '../dto/blind_box.dto';

@Provide()
export class BlindBoxService {
  @InjectEntityModel(BlindBox)
  blindBoxModel: Repository<BlindBox>;

  @InjectEntityModel(BlindBoxItem)
  blindBoxItemModel: Repository<BlindBoxItem>;

  @InjectEntityModel(UserOrder)
  userOrderModel: Repository<UserOrder>;

  @InjectEntityModel(User)
  userModel: Repository<User>;

  // 创建盲盒
  async createBlindBox(data: CreateBlindBoxDTO): Promise<ApiResponse<BlindBox>> {
    const box = this.blindBoxModel.create({
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      stock: data.stock,
      price: data.price,
    });
    await this.blindBoxModel.save(box);

    // 创建款式
    for (const itemData of data.items) {
      const item = this.blindBoxItemModel.create({
        ...itemData,
        boxId: box.id,
        totalQuantity: itemData.quantity * data.stock, // 总库存为每箱数量 * 总箱数
      });
      await this.blindBoxItemModel.save(item);
    }

    return {
      success: true,
      message: '盲盒创建成功',
      data: box
    };
  }

  // 获取所有盲盒
  async getAllBlindBoxes() {
    const boxes = await this.blindBoxModel.find({
      relations: ['items'],
      order: { createdAt: 'DESC' }
    });
    return {
      success: true,
      message: '获取盲盒列表成功',
      data: boxes
    };
  }

  // 获取盲盒详情
  async getBlindBoxById(id: number) {
    const box = await this.blindBoxModel.findOne({
      where: { id },
      relations: ['items']
    });
    if (!box) {
      throw new Error('盲盒不存在');
    }
    return {
      success: true,
      message: '获取盲盒详情成功',
      data: box
    };
  }

  // 购买盲盒
  async purchaseBlindBox(userId: number, boxId: number) {
    const user = await this.userModel.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('用户不存在');
    }

    const box = await this.blindBoxModel.findOne({ where: { id: boxId } });
    if (!box) {
      throw new Error('盲盒不存在');
    }

    if (box.stock <= 0) {
      throw new Error('盲盒库存不足');
    }

    // 获取有库存的款式
    const items = await this.blindBoxItemModel
      .createQueryBuilder('item')
      .where('item.boxId = :boxId', { boxId })
      .andWhere('item.totalQuantity > 0')
      .getMany();
    if (items.length === 0) {
      throw new Error('盲盒款式库存不足');
    }

    // 按权重随机选择款式（库存多的概率更大）
    const totalWeight = items.reduce((sum, item) => sum + item.quantity, 0);
    let randomWeight = Math.random() * totalWeight;
    let selectedItem = items[0];

    for (const item of items) {
      randomWeight -= item.quantity;
      if (randomWeight <= 0) {
        selectedItem = item;
        break;
      }
    }

    if (selectedItem.totalQuantity <= 0) {
      throw new Error('选中款式库存不足');
    }

    // 创建订单
    const order = this.userOrderModel.create({
      user,
      box,
      item: selectedItem,
      isRevealed: false,
    });
    await this.userOrderModel.save(order);

    // 减少库存
    box.stock -= 1;
    await this.blindBoxModel.save(box);

    // 更新款式库存
    selectedItem.totalQuantity -= 1;
    await this.blindBoxItemModel.save(selectedItem);

    return {
      success: true,
      message: '购买成功',
      data: {
        orderId: order.id,
        boxName: box.name,
        boxPrice: box.price,
        purchaseTime: order.purchaseTime,
        isRevealed: false
      }
    };
  }

  // 揭晓盲盒
  async revealBlindBox(orderId: number) {
    const order = await this.userOrderModel.findOne({
      where: { id: orderId },
      relations: ['item', 'box', 'user']
    });
    if (!order) {
      throw new Error('订单不存在');
    }

    if (order.isRevealed) {
      throw new Error('该盲盒已揭晓');
    }

    // 更新订单状态
    order.isRevealed = true;
    await this.userOrderModel.save(order);

    return {
      success: true,
      message: '揭晓成功',
      item: order.item,
      data: {
        orderId: order.id,
        boxName: order.box.name,
        itemName: order.item.name,
        itemDescription: order.item.description,
        itemImageUrl: order.item.imageUrl,
        revealTime: new Date()
      }
    };
  }

  // 获取用户订单
  async getUserOrders(userId: number) {
    const orders = await this.userOrderModel.find({
      where: { user: { id: userId } },
      relations: ['box', 'item'],
      order: { purchaseTime: 'DESC' }
    });
    return {
      success: true,
      message: '获取用户订单成功',
      data: orders
    };
  }

  public async deleteOrder(orderId: number): Promise<boolean> {
    try {
      const result = await this.userOrderModel.delete({ id: orderId });
      return result.affected === 1;
    } catch (error) {
      console.error('删除订单失败', error);
      return false;
    }
  }

  // 更新盲盒
  async updateBlindBox(data: UpdateBlindBoxDTO): Promise<ApiResponse<BlindBox>> {
    try {
      // 查找盲盒
      const box = await this.blindBoxModel.findOne({
        where: { id: data.id },
        relations: ['items']
      });

      if (!box) {
        return {
          success: false,
          message: '盲盒不存在'
        };
      }

      // 更新盲盒基本信息
      box.name = data.name;
      box.description = data.description;
      box.imageUrl = data.imageUrl;
      box.stock = data.stock;
      box.price = data.price;
      await this.blindBoxModel.save(box);

      // 获取现有款式的ID列表
      const existingItemIds = box.items.map(item => item.id);
      
      // 处理款式更新
      for (const itemData of data.items) {
        const itemId = (itemData as UpdateBlindBoxItemDTO).id;
        
        if (itemId && existingItemIds.includes(itemId)) {
          // 更新现有款式
          const item = await this.blindBoxItemModel.findOne({ where: { id: itemId } });
          if (item) {
            item.name = itemData.name;
            item.description = itemData.description;
            item.imageUrl = itemData.imageUrl;
            item.quantity = itemData.quantity;
            // 保持总库存与盲盒库存的比例关系
            item.totalQuantity = itemData.quantity * data.stock;
            await this.blindBoxItemModel.save(item);
          }
        } else {
          // 创建新款式
          const newItem = this.blindBoxItemModel.create({
            name: itemData.name,
            description: itemData.description,
            imageUrl: itemData.imageUrl,
            quantity: itemData.quantity,
            boxId: box.id,
            totalQuantity: itemData.quantity * data.stock,
          });
          await this.blindBoxItemModel.save(newItem);
        }
      }

      // 删除不再存在的款式
      const updatedItemIds = data.items
        .filter(item => (item as UpdateBlindBoxItemDTO).id)
        .map(item => (item as UpdateBlindBoxItemDTO).id);
      
      const itemsToRemove = existingItemIds.filter(id => !updatedItemIds.includes(id));
      
      for (const itemId of itemsToRemove) {
        // 检查该款式是否已被用户订单引用
        const orderWithItem = await this.userOrderModel.findOne({
          where: { item: { id: itemId } }
        });
        
        if (!orderWithItem) {
          // 如果没有订单引用该款式，则可以安全删除
          await this.blindBoxItemModel.delete(itemId);
        }
      }

      return {
        success: true,
        message: '盲盒更新成功',
        data: box
      };
    } catch (error) {
      console.error('更新盲盒失败', error);
      return {
        success: false,
        message: `更新盲盒失败: ${error.message}`
      };
    }
  }

  // 删除盲盒
  async deleteBlindBox(id: number) {
    try {
      // 查找盲盒
      const box = await this.blindBoxModel.findOne({
        where: { id },
        relations: ['items', 'orders']
      });

      if (!box) {
        return {
          success: false,
          message: '盲盒不存在'
        };
      }

      // 先删除与该盲盒相关的所有订单
      await this.userOrderModel.delete({ box: { id } });

      // 再删除与该盲盒相关的所有款式
      await this.blindBoxItemModel.delete({ box: { id } });

      // 最后删除盲盒本身
      await this.blindBoxModel.remove(box);

      return {
        success: true,
        message: '盲盒删除成功'
      };
    } catch (error) {
      console.error('删除盲盒失败', error);
      return {
        success: false,
        message: `删除盲盒失败: ${error.message}`
      };
    }
  }
}