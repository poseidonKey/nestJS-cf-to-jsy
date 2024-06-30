import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './posts/entities/posts.entity';
import { UsersModule } from './users/users.module';
import { UsersModel } from './users/entites/users.entity';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import {
  ENV_DB_DATABASE_KEY,
  ENV_DB_HOST_KEY,
  ENV_DB_PASSWORD_KEY,
  ENV_DB_PORT_KEY,
  ENV_DB_USERNAME_KEY,
  // ENV_DB_USERNAME_KEY,
  // ENV_DB_USERNAME_KEY,
  // ENV_DB_USERNAME_KEY,
} from './common/const/env-keys.const';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env[ENV_DB_HOST_KEY], // '127.0.0.1',
      port: parseInt(process.env[ENV_DB_PORT_KEY]), //5432,

      username: process.env[ENV_DB_USERNAME_KEY], // 'postgres',
      // username: process.env[process.env.ENV_DB_USERNAME_KEY],
      // username: 'postgres',
      password: process.env[ENV_DB_PASSWORD_KEY],
      // password: 'postgres',
      database: process.env[ENV_DB_DATABASE_KEY],
      // database: 'postgres',
      entities: [PostsModel, UsersModel],
      synchronize: true,
    }),
    PostsModule,
    UsersModule,
    AuthModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, //아래는 프로그램 전체에 적용하는 interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
