import { Body, Controller, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token/access')
  postTokenAccess(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    // {accessToken: {token}}형식으로 반환
    const newToken = this.authService.rotateToken(token, false);

    return {
      accessToken: newToken,
    };
  }

  @Post('token/refresh')
  postTokenRefresh(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    // {refreshToken: {token}}형식으로 반환
    const newToken = this.authService.rotateToken(token, true);

    return {
      refreshToken: newToken,
    };
  }

  @Post('login/email')
  postLoginEmail(@Headers('authorization') rawToken: string) {
    // loginEmail(@Body('email') email: string, @Body('password') password: string) {
    // email:password 가 Base 64로 변형돼 있다
    // 즉, alddlcodlk3ldlslscsldldl 식으로
    // 이것을 email:password 로 변형 시키고,
    // 다시 : 기준으로 분리해 사용한다.
    const token = this.authService.extractTokenFromHeader(rawToken, false);

    const credentials = this.authService.decodeBasicToken(token);

    return this.authService.loginWithEmail(credentials);
    // return this.authService.loginWithEmail({
    //   email,
    //   password,
    // });
  }

  @Post('register/email')
  postRegisterEmail(
    @Body('nickname') nickname: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.registerWithEmail({
      nickname,
      email,
      password,
    });
  }
}
