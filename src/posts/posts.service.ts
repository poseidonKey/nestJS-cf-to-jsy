import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, LessThan, MoreThan, Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/pagenate-post.dto';
import { HOST, PROTOCOL } from 'src/common/const/env.consts';
import { CommonService } from 'src/common/common.service';

export interface PostModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
    private readonly commonService: CommonService,
  ) {}

  async getAllPosts() {
    return await this.postsRepository.find({
      relations: ['author'],
    });
  }

  async paginatePosts(dto: PaginatePostDto) {
    return this.commonService.paginate(dto, this.postsRepository, {}, 'posts');
    // if (dto.page) {
    //   return this.pagePaginatePosts(dto);
    // } else return this.cursorPaginatePosts(dto);
  }

  async pagePaginatePosts(dto: PaginatePostDto) {
    /**
     * data:data[]
     * total:number
     * next 는 의미없다.
     * [1] [2] [3] ...
     */
    const [posts, count] = await this.postsRepository.findAndCount({
      skip: dto.take * (dto.page - 1),
      take: dto.take,
      order: {
        createdAt: dto.order__createdAt,
      },
    });
    return {
      data: posts,
      total: count,
    };
  }

  async cursorPaginatePosts(dto: PaginatePostDto) {
    const where: FindOptionsWhere<PostsModel> = {};
    if (dto.where__id__less_than) {
      where.id = LessThan(dto.where__id__less_than ?? 0);
    } else if (dto.where__id__more_than) {
      where.id = MoreThan(dto.where__id__more_than ?? 0);
    }

    const posts = await this.postsRepository.find({
      where: where,

      order: {
        createdAt: dto.order__createdAt,
      },
      take: dto.take,
    });
    const lastItem =
      posts.length > 0 && posts.length === dto.take
        ? posts[posts.length - 1]
        : null;

    const nextUrl = lastItem && new URL(`${PROTOCOL}://${HOST}/posts`);

    if (nextUrl) {
      /**
       * dto의 키 값들을 looping하면서
       * 키 값에 해당되는 값이 존재하면 param에 그대로 붙여 넣는다
       * 단 where__id_more_than 값만 lastItem의 마지막 값으로 넣어준다.
       */
      for (const key of Object.keys(dto)) {
        if (dto[key]) {
          if (
            key !== 'where__id__more_than' &&
            key !== 'where__id__less_than'
          ) {
            nextUrl.searchParams.append(key, dto[key]);
          }
        }
      }

      let key = null;
      if (dto.order__createdAt === 'ASC') key = 'where__id__more_than';
      else key = 'where__id__less_than';
      nextUrl.searchParams.append(key, lastItem.id.toString());
    }
    /**
     * Response
     *
     * data:Data[]
     * cursor:{
     *   after:마짐ㄱ 데이터의 id
     * }
     * count:응답한 데이터의 갯수
     * next : 다음 요청 할 때 사용할 URL
     */
    return {
      data: posts,
      cursor: {
        after: lastItem?.id ?? null,
      },
      count: posts.length,
      next: nextUrl?.toString() ?? null,
    };
  }

  async generatePosts(userId: number) {
    for (let i = 0; i < 100; i++) {
      await this.createPost(userId, {
        title: `임의로 생성된 포스트 제목 ${i}`,
        content: `임의로 생성된 포스트 내용 ${i}`,
      });
    }
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne({
      where: {
        id,
      },
      relations: ['author'],
    });
    if (!post) throw new NotFoundException();
    return post;
  }

  async createPost(authorId: number, postDto: CreatePostDto) {
    const post = this.postsRepository.create({
      author: {
        id: authorId,
      },
      ...postDto,
      likeCount: 0,
      commentCount: 0,
    });

    const newPost = await this.postsRepository.save(post);

    return newPost;
  }

  async updatePost(postId: number, postDto: UpdatePostDto) {
    const { title, content } = postDto;
    /**
     * save의 기능
     *  1) 만약 데이터가 존재하지 않는다면(id 기준으로) 생성한다
     *  2) 객체를 저장한다. create 메서드에서 생성한 객체로
     */

    const post = await this.postsRepository.findOne({
      where: {
        id: postId,
      },
    });
    if (!post) throw new NotFoundException('no data');

    if (title) post.title = title;
    if (content) post.content = content;
    const newPost = await this.postsRepository.save(post);

    return newPost;
  }

  async deletePost(postId: number) {
    const post = await this.postsRepository.findOne({
      where: {
        id: postId,
      },
    });
    if (!post) throw new NotFoundException('no data');
    return await this.postsRepository.delete(postId);

    return postId;
  }
}
