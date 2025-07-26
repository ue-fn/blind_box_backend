import { Controller, Post, Get, Body, Param, Inject, Put } from '@midwayjs/core';
import { BlindBoxService } from '../service/blind_box.service';
import { ApiTags, ApiOperation, ApiBody } from '@midwayjs/swagger';
import { CreateBlindBoxDTO, PurchaseBlindBoxDTO, UpdateBlindBoxDTO } from '../dto/blind_box.dto';

@ApiTags('盲盒模块')
@Controller('/blind-box')
export class BlindBoxController {
  @Inject()
  blindBoxService: BlindBoxService;

  // 创建盲盒
  @Post('/')
  @ApiOperation({ summary: '创建盲盒' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: '神秘盲盒' },
        description: { type: 'string', example: '包含多种精美款式的神秘盲盒' },
        imageUrl: { type: 'string', example: 'https://example.com/box.jpg' },
        stock: { type: 'number', example: 100 },
        price: { type: 'number', example: 25.99 },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', example: '款式1' },
              description: { type: 'string', example: '精美款式描述' },
              imageUrl: { type: 'string', example: 'https://example.com/item1.jpg' },
              quantity: { type: 'number', example: 10 }
            }
          }
        }
      }
    }
  })
  async createBlindBox(@Body() data: CreateBlindBoxDTO) {
    return await this.blindBoxService.createBlindBox(data);
  }

  @Post('/delete/:id')
  @ApiOperation({ summary: '删除盲盒' })
  async deleteBlindBox(@Param('id') id: number) {
    return await this.blindBoxService.deleteBlindBox(id);
  }

  // 更新盲盒
  @Put('/:id')
  @ApiOperation({ summary: '更新盲盒' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: '神秘盲盒' },
        description: { type: 'string', example: '包含多种精美款式的神秘盲盒' },
        imageUrl: { type: 'string', example: 'https://example.com/box.jpg' },
        stock: { type: 'number', example: 100 },
        price: { type: 'number', example: 25.99 },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', example: '款式1' },
              description: { type: 'string', example: '精美款式描述' },
              imageUrl: { type: 'string', example: 'https://example.com/item1.jpg' },
              quantity: { type: 'number', example: 10 },
              id: { type: 'number', example: 1 }
            }
          }
        }
      }
    }
  })
  async updateBlindBox(@Param('id') id: number, @Body() data: UpdateBlindBoxDTO) {
    data.id = id; // 确保ID一致
    return await this.blindBoxService.updateBlindBox(data);
  }

  
  

  // 获取所有盲盒
  @Get('/all')
  @ApiOperation({ summary: '获取所有盲盒' })
  async getAllBlindBoxes() {
    const res = await this.blindBoxService.getAllBlindBoxes();
    console.log(res)
    return res
  }

  // 获取盲盒详情
  @Get('/:id')
  @ApiOperation({ summary: '获取盲盒详情' })
  async getBlindBoxById(@Param('id') id: number) {
    return await this.blindBoxService.getBlindBoxById(id);
  }

  // 购买盲盒
  @Post('/purchase')
  @ApiOperation({ summary: '购买盲盒' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number', example: 1 },
        boxId: { type: 'number', example: 1 }
      },
      required: ['userId', 'boxId']
    }
  })
  async purchaseBlindBox(@Body() data: PurchaseBlindBoxDTO) {
    return await this.blindBoxService.purchaseBlindBox(data.userId, data.boxId);
  }

  // 揭晓盲盒
  @Post('/reveal')
  @ApiOperation({ summary: '揭晓盲盒' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        orderId: { type: 'number', example: 1 }
      },
      required: ['orderId']
    }
  })
  async revealBlindBox(@Body() body: { orderId: number }) {
    console.log('Reveal Blind Box:', body.orderId);
    return await this.blindBoxService.revealBlindBox(body.orderId);
  }

  // 获取用户订单
  @Get('/orders/:userId')
  @ApiOperation({ summary: '获取用户订单' })
  async getUserOrders(@Param('userId') userId: number) {
    return await this.blindBoxService.getUserOrders(userId);
  }

  @Get('/deleteOrder/:orderId')
  async deleteOrder(@Param('orderId') orderId: number): Promise<any> {
    try {
      console.log('Delete Order:', orderId);
      const result = await this.blindBoxService.deleteOrder(orderId);
      if (result) {
        return {
          success: true,
          message: '订单删除成功'
        };
      } else {
        return {
          success: false,
          message: '订单不存在或删除失败'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
}