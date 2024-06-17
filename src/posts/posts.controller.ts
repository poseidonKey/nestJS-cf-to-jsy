import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';

interface PostModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}
let posts: PostModel[] = [
  {
    id: 1,
    author: 'newjeans-offical',
    title: 'newjens minji',
    content: 'make up',
    likeCount: 80,
    commentCount: 25,
  },
  {
    id: 2,
    author: 'newjeans-offical',
    title: 'newjens jsy',
    content: 'make up',
    likeCount: 82,
    commentCount: 250,
  },
  {
    id: 3,
    author: 'newjeans-offical',
    title: 'newjens kuk',
    content: 'make up',
    likeCount: 800,
    commentCount: 25,
  },
];

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  /**
   * 1) GET /posts
   *     모든 post를 가져온다
   */
  @Get()
  getPosts(): PostModel[] {
    return posts;
  }
  /**
   * 2) GET /posts/:id
   *  id에 해당하는 post를 가져온다
   */
  @Get(':id')
  getPost(@Param('id') id: string) {
    const post = posts.find((post) => post.id === +id);
    if (!post) throw new NotFoundException('no data');
    return post;
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
    const post: PostModel = {
      id: posts[posts.length - 1].id + 1,
      title: title,
      author: author,
      content: content,
      likeCount: 0,
      commentCount: 0,
    };
    posts = [...posts, post];
    return post;
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
    const post: PostModel = posts.find((post) => post.id === +id);
    if (!post) throw new NotFoundException('no data');

    if (author) post.author = author;
    if (title) post.title = title;
    if (content) post.content = content;

    posts = posts.map((prevPost) => (prevPost.id === +id ? post : prevPost));

    return post;
  }

  /**
   * 5) DELETE /posts/:id
   *  id에 해당하는 post를 삭제한다
   */
  @Delete(':id')
  deletePost(@Param('id') id: string) {
    const post: PostModel = posts.find((post) => post.id === +id);
    if (!post) throw new NotFoundException('no data');
    posts = posts.filter((post) => post.id !== +id);
    return id;
  }
}
