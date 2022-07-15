import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { Category } from './entities/category.entity';
import { CategoryNotFoundException } from './exceptions/category-not-found.exception';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const newCategory = this.categoriesRepository.create(createCategoryDto);
    await this.categoriesRepository.save(newCategory);
    return newCategory;
  }

  findAll() {
    return this.categoriesRepository.find({ relations: ['posts'] });
  }

  async findOne(id: number) {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['posts'],
    });
    if (category) return category;
    throw new CategoryNotFoundException(id);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.categoriesRepository.update(id, updateCategoryDto);
    const updatedCategory = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['posts'],
    });
    if (updatedCategory) return updatedCategory;
    throw new CategoryNotFoundException(id);
  }

  async remove(id: number) {
    const result = await this.categoriesRepository.delete(id);
    if (!result.affected) throw new CategoryNotFoundException(id);
  }
}
