import { UsersModel } from 'src/users/entites/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PostsModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsersModel, (user) => user.posts, { nullable: false })
  // 1. UserModel과 연동한다. foreign key 이용
  // 2. null 이 될 수 없다.
  author: UsersModel;

  @Column()
  title: string;
  @Column()
  content: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;
}
