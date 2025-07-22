import { Inject, Controller, Get, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';

@Controller('/api')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Get('/getUserInfo')
  async getUserInfo(@Query() userId: string): Promise<any> {
    const userInfo = await this.userService.getUserInfo(
      this.ctx.session.userId
    );
    return {
      code: 200,
      data: userInfo,
    };
  }
}
