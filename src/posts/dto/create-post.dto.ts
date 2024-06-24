import { PickType } from '@nestjs/mapped-types';
import { PostsModel } from '../entities/posts.entity';

export class CreatePostDto extends PickType(PostsModel, ['title', 'content']) {}
// export class CreatePostDto extends Pick<PostsModel, 'title'> {}
