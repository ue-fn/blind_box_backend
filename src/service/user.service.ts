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
  public async deleteUserByUsername(username: string): Promise<boolean> {
    try {
      const result = await this.userModel.delete({ username });
      return result.affected === 1;
    } catch (error) {
      console.error('删除用户失败', error);
      return false;
    }
  }
}
