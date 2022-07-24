import { Express } from 'express';
import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards';
import { RequestWithUser } from '../auth/interfaces';
import { UsersService } from './users.service';
import { diskStorage } from 'multer';
import { LocalFilesInterceptor } from '../files/interceptors/files.interceptor';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('avatar/upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    LocalFilesInterceptor({
      path: '/avatars',
      fieldName: 'file',
      fileFilter(_req, file, callback) {
        if (!file.mimetype.includes('image'))
          return callback(
            new BadRequestException('Provide a valid image'),
            false,
          );
        callback(null, true);
      },
      limits: { fileSize: Math.pow(1024, 2) }, // 1 mb
    }),
  )
  async uploadAvatar(
    @Req() req: RequestWithUser,
    @UploadedFile() { filename, mimetype, path }: Express.Multer.File,
  ) {
    return this.usersService.uploadAvatar(req.user.id, {
      path,
      filename,
      mimetype,
    });
  }
}
