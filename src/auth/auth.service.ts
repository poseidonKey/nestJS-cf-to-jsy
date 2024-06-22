import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entites/users.entity';
import { HASH_ROUNDS, JWT_SECRET } from './const/auth.const';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  /**
   * 만드는 기능
   * 1. registerWithEmail
   *   - email,nickname, password 를 입력받고 사용자를 생성
   *   - 생성이 완료되면 accessToken, refreshToken을 반환
   *   - 회원가입하면 바로 로그인까지 처리 되도록 한다.
   *
   * 2. loginWithEmail
   *   - email, password를 입력하면 사용자 검증 실시
   *   - 검증 완료되면 access, refreshToken을 반환
   *
   * 3. loginUser
   *   - 1, 2에서 필요한 access,refreshToken을 반환하는 목적
   *
   * 4. signToken : 실제 token을 생성하는 로직
   *   - 3에서 필요한 access, refreshToken을 sign하는 로직
   *
   * 5. authenticateWithEmailAndPassword
   *   - 2에서 로그인을 진행할 때 필요한 기본적인 검증 진행
   *      *. 사용자가 존재하는 지 확인(email)
   *      *. 비밀번호가 맞는지 확인
   *      *. 모두 통과되면 찾은 사용자 정보 반환
   *      *. loginWithEmail에서 반환된 데이터를 기반으로 토큰 생성
   */

  // signToken 만들기
  /**
   * payload에 들어갈 정보
   * 1. email
   * 2. sub : id
   * 3. type: 'access' | 'refresh'
   */

  singToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: isRefreshToken ? 3600 : 300, // 만료 시간 설정
    });
  }

  loginUser(user: Pick<UsersModel, 'email' | 'id'>) {
    return {
      accessToken: this.singToken(user, false),
      refreshToken: this.singToken(user, true),
    };
  }

  async authenticateWithEmailAndPassword(
    user: Pick<UsersModel, 'email' | 'password'>,
  ) {
    const existingUser = await this.usersService.getUserByEmail(user.email);
    if (!existingUser) {
      throw new UnauthorizedException('존재하지 않는 사용자');
    }
    /**
     * 파라미터
     *  1. 입력 된 비밀번호
     *  2. 입력된 해시와 사용자 정보에 저장돼 있는 해시와 비교
     */
    const passOk = await bcrypt.compare(user.password, existingUser.password);
    if (!passOk) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다.');
    }

    return existingUser;
  }

  async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
    const existingUser = await this.authenticateWithEmailAndPassword(user);

    return this.loginUser(existingUser);
  }

  async registerWithEmail(
    user: Pick<UsersModel, 'nickname' | 'email' | 'password'>,
  ) {
    await bcrypt.hash(user.password, HASH_ROUNDS);

    const newUser = await this.usersService.createUser(user);

    return this.loginUser(newUser);
  }
}
