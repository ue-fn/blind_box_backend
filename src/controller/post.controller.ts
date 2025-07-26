import { Inject, Controller, Post, Get, Query, Body, Param, Files, Fields } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { PostService } from '../service/post.service';
import { PostResponse, PostListQuery } from '../dto/post.dto';
import { ApiBearerAuth, ApiResponse, ApiTags, ApiOperation } from '@midwayjs/swagger';
import * as path from 'path';
@ApiBearerAuth()
@ApiTags(['帖子'])
@Controller('/posts')
export class PostController {
  @Inject()
  ctx: Context;

  @Inject()
  postService: PostService;

  @Post('/')
  async createPost(@Files() files, @Fields() fields) {
    try {
      // 1. 获取表单字段
      console.log(fields, files)
      const userId = parseInt(fields.userId); // FormData中的文本字段
      const content = fields.content;

      // 2. 处理上传的图片
      let imageUrl = null;
      if (files && files.length > 0) {
        // 直接使用接收到的文件对象
        const file = files[0]; // 获取上传的文件

        // 从临时文件路径中提取文件名
        const fileName = path.basename(file.data);
        console.log('文件名', fileName)
        // 设置可访问的URL
        imageUrl = `/public/uploads/${fileName}`;
      }
      console.log('帖子信息', userId, content, imageUrl)
      // 3. 调用服务创建帖子
      return this.postService.createPost(userId, content, imageUrl);
    } catch (error) {
      // 4. 错误处理
      console.error('创建帖子失败:', error);
      return { success: false, message: '创建帖子失败' };
    }
  }

  @Get('/')
  @ApiResponse({
    status: 200,
    description: '获取帖子列表',
    type: PostResponse,
  })
  async getPosts(@Query() query: PostListQuery) {
    return this.postService.getPosts(query);
  }

  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: '获取帖子详情',
    type: PostResponse,
  })
  async getPost(@Param('id') id: number) {
    return this.postService.getPost(id);
  }

  @Get('/cancel/:id')
  @ApiResponse({
    status: 200,
    description: '删除帖子',
    type: PostResponse,
  })
  async deletePost(@Param('id') id: number) {
    return this.postService.deletePost(id);
  }



  @Post('/like')
  @ApiResponse({
    status: 200,
    description: '点赞帖子',
    type: PostResponse,
  })
  async likePost(@Body() body: { postId: number, userId: number }) {
    return this.postService.likePost(body.postId, body.userId);
  }

  @Get('/cancel/:id/like')
  @ApiResponse({
    status: 200,
    description: '取消点赞帖子',
    type: PostResponse,
  })
  async unlikePost(@Param('id') postId: number) {
    const userId = this.ctx.state.user.id;
    return this.postService.unlikePost(postId, userId);
  }

  @Get('/user/:userId')
  @ApiOperation({ summary: '获取用户帖子' })
  async getUserPosts(@Param('userId') userId: number) {
    return await this.postService.getUserPosts(userId);
  }

}