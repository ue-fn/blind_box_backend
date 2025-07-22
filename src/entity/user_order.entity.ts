import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BlindBox } from './blind_box.entity';
import { BlindBoxItem } from './blind_box_item.entity';

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
}

export default UserOrder;