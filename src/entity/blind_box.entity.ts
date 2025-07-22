import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BlindBoxItem } from './blind_box_item.entity';
import { UserOrder } from './user_order.entity';

@Entity()
export class BlindBox {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string;

  @Column({ type: 'integer' })
  stock: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @OneToMany(() => BlindBoxItem, (item) => item.box)
  items: BlindBoxItem[];

  @OneToMany(() => UserOrder, (order) => order.box)
  orders: UserOrder[];

  @CreateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '创建时间',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    comment: '更新时间',
  })
  updatedAt: Date;
}

export default BlindBox