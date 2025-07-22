import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserOrder } from './user_order.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 20,
    unique: true,
    nullable: false,
    comment: '用户名，长度3-20个字符',
  })
  username: string;

  @Column({
    length: 100,
    nullable: false,
    comment: '密码，最少6个字符',
  })
  password: string;

  @Column({
    length: 255,
    comment: '用户头像URL',
  })
  avatar: string;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '创建时间',
  })
  createdAt: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    comment: '更新时间',
  })
  updatedAt: Date;

  @OneToMany(() => UserOrder, (order) => order.user)
  orders: UserOrder[];
}

export default User;
// 这里导出 User 实体，方便在其他文件中用
