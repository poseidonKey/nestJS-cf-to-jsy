import {
  Body,
  Controller,
  // DefaultValuePipe,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  // Put,
  // Request,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/users/decorator/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/pagenate-post.dto';
import { ImageModelType } from 'src/common/entity/image.entity';
import { DataSource } from 'typeorm';
import { PostsImagesService } from './image/images.service';
// import { UsersModel } from 'src/users/entites/users.entity';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly dataSource: DataSource,
    private readonly postsImagesService: PostsImagesService,
  ) {}
  /**
   * 1) GET /posts
   *     모든 post를 가져온다
   */
  @Get()
  getPosts(@Query() query: PaginatePostDto) {
    return this.postsService.paginatePosts(query);
    // return this.postsService.getAllPosts();
  }

  @Post('random')
  @UseGuards(AccessTokenGuard)
  async postPostsRandom(@User('id') userId: number) {
    await this.postsService.generatePosts(userId);
    return true;
  }

  /**
   * 2) GET /posts/:id
   *  id에 해당하는 post를 가져온다
   */
  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  /**
   * 3) Post /posts
   *  post를 생성한다
   */

  // DTO :data transfer Object

  /**
   * transation : all or nothing 의미
   * start
   * commit -> save
   * error -> rollback 즉 하나라도 문제가 있으면 모든 작업을 취소
   */
  @Post()
  @UseGuards(AccessTokenGuard)
  async postPost(
    // @Request() req: any, //User decorator를 사용하므로 더 이상 필요없다
    @User('id') userId: number,
    // @User() user: UsersModel,

    // @Body('authorId') authorId: number,
    @Body() body: CreatePostDto,
    // @Body('title') title: string,
    // @Body('content') content: string,
    // @Body('isPublic', new DefaultValuePipe(true)) isPublic: boolean, // DefaultValue연습용
    // @UploadedFile() file?: Express.Multer.File,
  ) {
    const qr = this.dataSource.createQueryRunner();

    await qr.connect();

    try {
      // const authorId = req.user.id;
      const post = await this.postsService.createPost(userId, body, qr);

      for (let i = 0; i < body.images.length; i++) {
        await this.postsImagesService.createPostImage(
          {
            post,
            order: i,
            path: body.images[i],
            type: ImageModelType.POST_IMAGE,
          },
          qr,
        );
      }
      await qr.commitTransaction();
      await qr.release();

      return this.postsService.getPostById(post.id);
      // return this.postsService.createPost(title, authorId, content);
    } catch (error) {
      await qr.rollbackTransaction();
      await qr.release();

      throw new InternalServerErrorException('error 가 났습니다.');
    }
  }

  /**
   * 4) PUT /posts/:id
   *  id에 해당하는 post를 업데이트 하거나 새로 생성
   */
  @Patch(':id')
  patchPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePostDto,
    // @Body('title') title?: string,
    // @Body('content') content?: string,
  ) {
    return this.postsService.updatePost(id, body);
  }

  /**
   * 5) DELETE /posts/:id
   *  id에 해당하는 post를 삭제한다
   */
  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }
}
