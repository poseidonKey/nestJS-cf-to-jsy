import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // postUser(
  //   @Body('nickname') nickname: string,
  //   @Body('email') email: string,
  //   @Body('password') password: string,
  // ) {
  //   return this.usersService.createUser({ nickname, email, password });
  // }

  @Get()
  // @UseInterceptors(ClassSerializerInterceptor)
  /**
   * serialization -> 직렬화 -> 현재 시스템에서 사용되는(NestJS) 데이터 구조를 다른 시스템에서도
   *                    쉽게 사용할 수 잇는 포멧으로 변환
   *                    -> class의 object에서 Json 포멧으로 변환
   * deserialization -> 역 직렬화
   */
  getUsers() {
    return this.usersService.getAllUsers();
  }
}
