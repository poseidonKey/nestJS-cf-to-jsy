import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { UsersModel } from '../entites/users.entity';

export const User = createParamDecorator(
  (data: keyof UsersModel | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const user = req.user as UsersModel;
    if (!user) {
      throw new InternalServerErrorException(
        'Request 에 user 프로퍼티가 존재하지 않습니다. \nUser 데코레이터는 AccessTokenGuard와 함께 사용해야 합니다.',
      );
    }
    if (user) {
      return user[data];
    }
  },
);
