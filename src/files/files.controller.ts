import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Res,
  StreamableFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { Readable } from 'stream';
import { FilesService } from './files.service';

@Controller('files')
@UseInterceptors(ClassSerializerInterceptor)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get(':id')
  async getFileById(
    // add passthrough: true to avoid hanging
    @Res({ passthrough: true }) res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const file = await this.filesService.getFileById(id);
    const stream = Readable.from(file.data);
    res.set({
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Content-Type': 'image',
    });
    return new StreamableFile(stream);
  }
}
