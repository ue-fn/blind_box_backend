import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BlindBox } from './blind_box.entity';
import { BlindBoxItem } from './blind_box_item.entity';

// 订单状态枚举
export enum OrderStatus {
  PENDING_SHIPMENT = 0, // 未发货
  PENDING_RECEIPT = 1,  // 待收货
  COMPLETED = 2         // 已完成
}

// 订单状态映射
export const OrderStatusMap = {
  [OrderStatus.PENDING_SHIPMENT]: '未发货',
  [OrderStatus.PENDING_RECEIPT]: '待收货',
  [OrderStatus.COMPLETED]: '已完成'
}

@Entity()
export class UserOrder {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @ManyToOne(() => BlindBox, (box) => box.orders)
  box: BlindBox;

  @ManyToOne(() => BlindBoxItem, (item) => item.orders)
  item: BlindBoxItem;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  purchaseTime: Date;

  @Column({ type: 'boolean', default: false })
  isRevealed: boolean; // 是否已揭晓

  @Column({ 
    type: 'integer', 
    default: OrderStatus.PENDING_SHIPMENT,
    comment: '订单状态：0-未发货，1-待收货，2-已完成'
  })
  status: number;
}

export default UserOrder;