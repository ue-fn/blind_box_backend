import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BlindBox } from './blind_box.entity';
import { UserOrder } from './user_order.entity';

@Entity()
export class BlindBoxItem {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: 'integer' })
  quantity: number; // 每箱盲盒中该款式的数量

  @Column({ type: 'integer' })
  totalQuantity: number; // 总库存数量

  @Column({ type: 'boolean', default: false })
  isRevealed: boolean; // 是否已揭晓

  @OneToMany(() => UserOrder, (order) => order.item)
  orders: UserOrder[];

  @Column({ type: 'integer' })
  boxId: number;

  @ManyToOne(() => BlindBox, (box) => box.items)
  @JoinColumn({ name: 'boxId' })
  box: BlindBox;
}

export default BlindBoxItem;
// 这里导出 BlindBoxItem 实体，方便在其他文件中用