import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Post, Like, User } from '../entity';
import { PostListQuery } from '../dto/post.dto';

@Provide()
export class PostService {
  @InjectEntityModel(Post)
  postModel: Repository<Post>;

  @InjectEntityModel(Like)
  likeModel: Repository<Like>;

  @InjectEntityModel(User)
  userModel: Repository<User>;

  async createPost(userId: number, content: string, image?: string) {
    const user = await this.userModel.findOne({ where: { id: userId } });
    if (!user) {
      return { success: false, message: '用户不存在' };
    }


    const newPost = this.postModel.create({
      author: user,
      content,
      image,
    });

    await this.postModel.save(newPost);
    console.log(newPost);
    return { success: true, message: '创建成功', data: newPost };
  }

  async getPosts(query: PostListQuery) {
    const { page = 1, pageSize = 10, userId } = query;
    const queryBuilder = this.postModel
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .orderBy('post.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    if (userId) {
      queryBuilder.where('author.id = :userId', { userId });
    }

    const [posts, total] = await queryBuilder.getManyAndCount();
    return {
      success: true,
      message: '获取成功',
      data: { posts, total, page, pageSize },
    };
  }

  async getPost(id: number) {
    const post = await this.postModel.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      return { success: false, message: '帖子不存在' };
    }

    return { success: true, message: '获取成功', data: post };
  }

  async getUserPosts(userId: number) {
    const posts = await this.postModel.find({
      where: { author: { id: userId } },
      relations: ['author'],
    });
    return { success: true, message: '获取成功', data: posts };
  }

  async deletePost(id: number) {
    const post = await this.postModel.findOne({
      where: { id },
      relations: ['author', 'likes'],
    });

    if (!post) {
      return { success: false, message: '帖子不存在' };
    }

    // 先删除与该帖子相关的所有点赞记录
    await this.likeModel.delete({ post: { id } });
    
    // 然后删除帖子
    await this.postModel.remove(post);
    return { success: true, message: '删除成功' };
  }



  async likePost(postId: number, userId: number) {
    const post = await this.postModel.findOne({ where: { id: postId } });
    if (!post) {
      return { success: false, message: '帖子不存在' };
    }

    const existingLike = await this.likeModel.findOne({
      where: {
        user: { id: userId },
        post: { id: postId },
      },
    });

    if (existingLike) {
      return { success: false, message: '已经点赞过了' };
    }

    const user = await this.userModel.findOne({ where: { id: userId } });
    const like = this.likeModel.create({
      user,
      post,
    });

    await this.likeModel.save(like);
    // 更新帖子点赞数
    post.likeCount += 1;
    await this.postModel.save(post);

    return { success: true, message: '点赞成功' };
  }

  async unlikePost(postId: number, userId: number) {
    const like = await this.likeModel.findOne({
      where: {
        user: { id: userId },
        post: { id: postId },
      },
    });

    if (!like) {
      return { success: false, message: '还没有点赞' };
    }

    await this.likeModel.remove(like);
    // 更新帖子点赞数
    const post = await this.postModel.findOne({ where: { id: postId } });
    if (post) {
      post.likeCount -= 1;
      await this.postModel.save(post);
    }

    return { success: true, message: '取消点赞成功' };
  }


}