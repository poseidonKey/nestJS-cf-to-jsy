import { IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { ImageModel } from 'src/common/entity/image.entity';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { UsersModel } from 'src/users/entites/users.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PostsModel extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsersModel, (user) => user.posts, { nullable: false })
  // 1. UserModel과 연동한다. foreign key 이용
  // 2. null 이 될 수 없다.
  author: UsersModel;

  // @Column()
  // title: string;
  // @Column()
  // content: string;

  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  title: string;

  @IsString({
    message: stringValidationMessage,
  })
  content: string;

  // @Column({
  //   nullable: true,
  // })
  // @Transform(({ value }) => value && `/${join(POST_PUBLIC_IMAGE_PATH, value)}`)
  // image?: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany((type) => ImageModel, (image) => image.post)
  images: ImageModel[];
}
