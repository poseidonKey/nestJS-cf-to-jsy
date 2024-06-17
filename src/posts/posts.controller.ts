import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostModel, PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  /**
   * 1) GET /posts
   *     모든 post를 가져온다
   */
  @Get()
  getPosts(): PostModel[] {
    return this.postsService.getAllPosts();
  }
  /**
   * 2) GET /posts/:id
   *  id에 해당하는 post를 가져온다
   */
  @Get(':id')
  getPost(@Param('id') id: string): PostModel {
    return this.postsService.getPostById(+id);
  }

  /**
   * 3) Post /posts
   *  post를 생성한다
   */
  @Post()
  postPost(
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    return this.postsService.createPost(title, author, content);
  }
  /**
   * 4) PUT /posts/:id
   *  id에 해당하는 post를 업데이트 하거나 새로 생성
   */
  @Put(':id')
  putPost(
    @Param('id') id: string,
    @Body('author') author?: string,
    @Body('title') title?: string,
    @Body('content') content?: string,
  ) {
    return this.postsService.updatePost(+id, author, title, content);
  }

  /**
   * 5) DELETE /posts/:id
   *  id에 해당하는 post를 삭제한다
   */
  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(+id);
  }
}
