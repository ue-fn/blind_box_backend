import { ApiProperty } from '@midwayjs/swagger';

export class CreatePostDTO {
  @ApiProperty({ description: '用户ID', required: false })
  userId?: number;
  @ApiProperty({ description: '帖子内容' })
  content: string;

  @ApiProperty({ description: '帖子图片URL', required: false })
  image?: string;


}



export class PostResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface PostListQuery {
  userId?: number;
}