import { IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { UsersModel } from 'src/users/entites/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @IsString({
    message: '타이틀은 string 타입을 입력해야 합니다.',
  })
  title: string;

  @IsString({
    message: 'content는 string 타입을 입력해야 합니다.',
  })
  content: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;
}
