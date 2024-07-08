import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './entities/posts.entity';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UsersModel } from 'src/users/entites/users.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';
import { ImageModel } from 'src/common/entity/image.entity';
import { PostsImagesService } from './image/images.service';

// import {
//   POST_IMAGE_PATH,
//   POST_PUBLIC_IMAGE_PATH,
//   PUBLIC_FOLDER_NAME,
// } from 'src/common/const/path.const';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostsModel, UsersModel, ImageModel]),
    AuthModule,
    UsersModule,
    CommonModule,
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    JwtService,
    AuthService,
    UsersService,
    PostsImagesService,
  ],
})
export class PostsModule {}
