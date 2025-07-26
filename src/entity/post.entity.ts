import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Like } from './like.entity';
@Entity('post')
export class Post {
    @PrimaryGeneratedColumn()
    id: number;



    @Column({
        type: 'text',
        nullable: false,
        comment: '帖子内容',
    })
    content: string;

    @Column({
        nullable: true,
        comment: '帖子图片URL',
    })
    image: string;

    @Column({
        default: 0,
        comment: '点赞数',
    })
    likeCount: number;



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

    @ManyToOne(() => User, (user) => user.posts)
    author: User;

    @OneToMany(() => Like, (like) => like.post)
    likes: Like[];
}

export default Post;