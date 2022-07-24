import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { File } from './entities/file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File) private readonly filesRepository: Repository<File>,
  ) {}

  async uploadFile(
    dataBuffer: Buffer,
    filename: string,
    queryRunner: QueryRunner,
  ) {
    const newFile = queryRunner.manager.create(File, {
      data: dataBuffer,
      filename,
    });
    await queryRunner.manager.save(newFile);
    return newFile;
  }

  async deleteFile(fileId: number, queryRunner: QueryRunner) {
    const { affected } = await queryRunner.manager.delete(File, fileId);
    if (!affected) throw new NotFoundException();
  }

  async getFileById(fileId: number) {
    const file = await this.filesRepository.findOne({ where: { id: fileId } });
    if (file) return file;
    throw new NotFoundException();
  }
}
