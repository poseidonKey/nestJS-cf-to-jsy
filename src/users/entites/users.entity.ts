import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RolesEnum } from '../const/roles.const';
// import { PostModel } from 'src/posts/posts.service';
import { PostsModel } from 'src/posts/entities/posts.entity';
import { BaseModel } from 'src/common/entity/base.entity';
import { IsEmail, IsString, Length } from 'class-validator';
import { lengthValidationMessage } from 'src/common/validation-message/length-validation.message';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { emailValidationMessage } from 'src/common/validation-message/email-validation.message';
import { Exclude } from 'class-transformer';
// import { Exclude, Expose } from 'class-transformer';

@Entity()
// @Exclude() : 모든 엔티티를 감추고, 보여주고 싶은 것만 @Expose()를 통해 구현하면 된다.
export class UsersModel extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 20,
    unique: true,
  })
  // 1. 길이가 20을 넘지 않을 것
  // 2. 유일무이한 값
  @IsString({
    message: stringValidationMessage,
  })
  // 일반적인 사용
  // @Length(1, 20, {
  //   message: 'nickname은 1~20자 사이로 입력',
  // })
  @Length(1, 20, {
    message: lengthValidationMessage,
  })
  nickname: string;

  @Column({
    unique: true,
  })
  //  유일무이한 값
  @IsString({
    message: stringValidationMessage,
  })
  @IsEmail({}, { message: emailValidationMessage })
  email: string;

  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  @Length(3, 8, {
    message: lengthValidationMessage, //'비번은 3~8자 사이로 입력',
  })
  /**
   * Request
   * frontend -> backend
   * plain object(json) -> class instance(dto)
   *
   * Response
   * backend -> frontend
   * claas instanc -> plain object
   *
   * option을 살펴보면
   * toClassOnly :class instance로 변환 될 때만
   * toPlainOnly :plain object로 변환 될 때만
   *
   * 따라서 현재 상황에서는 response에만 적용하면 된다.
   */
  @Exclude({
    toPlainOnly: true,
  })
  password: string;

  @Column({
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;

  @OneToMany(() => PostsModel, (post) => post.author)
  posts: PostsModel[];
}
