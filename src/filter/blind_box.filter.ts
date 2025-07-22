import { Catch } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Catch()
export class BlindBoxErrorFilter {
  async catch(err: Error, ctx: Context) {
    // 记录错误日志
    ctx.logger.error('BlindBox Error:', err);

    // 返回统一的错误格式
    return {
      success: false,
      message: err.message || '服务器内部错误',
      data: null,
      timestamp: new Date().toISOString(),
      path: ctx.path
    };
  }
}