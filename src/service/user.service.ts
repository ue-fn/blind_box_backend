import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { User } from '../entity';
import { Repository } from 'typeorm';
@Provide()
export class UserService {
  @InjectEntityModel(User)
  private userModel: Repository<User>;
  public async register(
    username: string,
    password: string,
    avatar: string
  ): Promise<boolean> {
    try {
      console.log('正在检查用户:', username);
      const existingUser = await this.userModel.findOne({
        where: { username },
        select: ['id', 'username', 'avatar'],
      });
      console.log('查询结果:', existingUser);
      if (existingUser) {
        console.log('用户名已存在，用户详情:', existingUser);
        return false;
      }

      const newUser = this.userModel.create({
        username,
        password: password,
        avatar: avatar,
      });

      await this.userModel.save(newUser);
      return true;
    } catch (error) {
      console.error('注册失败', error);
      return false;
    }
  }

  public async login(username: string, password: string): Promise<boolean> {
    try {
      const user = await this.userModel.findOne({ where: { username } });
      if (!user) {
        console.log('用户不存在');
        return false;
      }
      console.log(user);
      if (!user.password) {
        console.log('用户密码未设置');
        return false;
      }
      console.log(user.username, password, user.password);
      if (password === user.password) {
        console.log('密码匹配成功');
        return true;
      }
      else {
        console.log('密码错误');
        return false;
      }

    } catch (error) {
      console.error('登录失败', error);
      return false;
    }
  }

  public async getUserInfo(userId: string): Promise<User | null> {
    try {
      const user = await this.userModel.findOne({
        where: { username: userId },
      });
      console.log('获取用户信息成功', user);
      return user;
    } catch (error) {
      console.error('获取用户信息失败', error);
      return null;
    }
  }

  public async getAllUsers(): Promise<User[]> {
    try {
      // 查询所有用户，按创建时间降序排列
      const users = await this.userModel.find({
        select: ['id', 'username', 'avatar', 'createdAt', 'updatedAt'],
        order: { createdAt: 'DESC' }
      });
      return users;
    } catch (error) {
      console.error('获取所有用户失败', error);
      return [];
    }
  }
  public async deleteUserByUsername(username: string): Promise<boolean> {
    try {
      // 查找用户
      const user = await this.userModel.findOne({
        where: { username },
        relations: ['orders', 'posts', 'likes']
      });

      if (!user) {
        console.log('用户不存在');
        return false;
      }

      // 管理员账号不允许删除
      if (user.id === 11) {
        console.log('管理员账号不允许删除');
        return false;
      }

      // 使用事务确保数据一致性
      const queryRunner = this.userModel.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // 删除用户的点赞
        if (user.likes && user.likes.length > 0) {
          await queryRunner.manager.delete('like', { user: user.id });
        }

        // 删除用户的帖子和帖子相关的点赞
        if (user.posts && user.posts.length > 0) {
          for (const post of user.posts) {
            await queryRunner.manager.delete('like', { post: post.id });
          }
          await queryRunner.manager.delete('post', { author: user.id });
        }

        // 删除用户的订单
        if (user.orders && user.orders.length > 0) {
          await queryRunner.manager.delete('user_order', { user: user.id });
        }

        // 最后删除用户
        await queryRunner.manager.delete('user', { id: user.id });

        // 提交事务
        await queryRunner.commitTransaction();
        return true;
      } catch (error) {
        // 回滚事务
        await queryRunner.rollbackTransaction();
        console.error('删除用户事务失败', error);
        return false;
      } finally {
        // 释放查询运行器
        await queryRunner.release();
      }
    } catch (error) {
      console.error('删除用户失败', error);
      return false;
    }
  }
}
