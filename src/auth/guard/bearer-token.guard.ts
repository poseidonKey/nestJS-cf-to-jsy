import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    // {'authorization': 'Bearer adldlcoocooccocll'}
    // 'adldlcoocooccocll' 을 가져옴
    const rawToken = req.headers['authorization'];
    if (!rawToken) {
      throw new UnauthorizedException('토큰이 없습니다.');
    }

    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const result = await this.authService.verifyToken(token);
    /**
     * request에 넣을 정보
     * 1.사용자 정보
     * 2. token
     * 3. tokenType - access | refresh
     */
    const user = await this.usersService.getUserByEmail(result.email);
    req.user = user;
    req.token = token;
    req.tokenType = result.type;

    return true;
  }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    super.canActivate(context);

    const req = context.switchToHttp().getRequest();
    if (req.tokenType !== 'access') {
      throw new UnauthorizedException('access Token이 아닙니다.');
    }

    return true;
  }
}

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    super.canActivate(context);

    const req = context.switchToHttp().getRequest();
    if (req.tokenType !== 'refresh') {
      throw new UnauthorizedException('refresh Token이 아닙니다.');
    }

    return true;
  }
}
