import { Controller, Get, Inject, Post, Query } from '@midwayjs/core';
import { UserService } from '../service/user.service';

@Controller('/')
export class HomeController {
  @Inject()
  userService: UserService;
  @Get('/home')
  async home(): Promise<string> {
    return 'Hello Midwayjs!';
  }

  @Get('/viewing')
  async view(): Promise<string> {
    return 'Hello Midwayjs!';
  }

  @Post('/register')
  public async register(
    @Query('username') username: string,
    @Query('password') password: string,
    @Query('avatar') avatar: string
  ): Promise<boolean> {
    console.log(username, password, avatar);
    // 这里可以调用 UserService 的 register 方法进行注册逻辑
    const result = this.userService.register(username, password, avatar);
    // 返回注册结果
    console.log('注册成功');

    return result;
  }
}
