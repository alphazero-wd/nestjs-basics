import { NotFoundException } from '@nestjs/common';

export class CategoryNotFoundException extends NotFoundException {
  constructor(categoryId: number) {
    super(`Cannot find category with the id: ${categoryId}.`);
  }
}
