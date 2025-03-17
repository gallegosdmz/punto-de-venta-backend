import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CustomValidations } from 'src/utils/validations';
import { handleDBErrors } from 'src/utils/errors';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository( Category )
    private readonly categoryRepository: Repository<Category>,
    private readonly customValidations: CustomValidations,
  ) {

  }

  async create(createCategoryDto: CreateCategoryDto) {
    await this.customValidations.verifyNameExist( Category, createCategoryDto.name );

    try {
      const category = this.categoryRepository.create( createCategoryDto );
      await this.categoryRepository.save( category );

      return category;

    } catch ( error ) {
      handleDBErrors( error, 'create - categories' );
    }
  }

  async findAll() {
    try {
      const categories = await this.categoryRepository.find({
        where: {
          isDeleted: false,
        },
        relations: {
          products: true,
        },
      });

      return categories;

    } catch ( error ) {
      handleDBErrors( error, 'findAll - categories' );
    }
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
      relations: {
        products: true,
      },
    });
    if ( !category ) throw new NotFoundException(`Category with id: ${ id } not found`);

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne( id );
    await this.customValidations.verifyNameRepeat( Category, id, updateCategoryDto.name! );

    try {
      Object.assign( category, updateCategoryDto );
      await this.categoryRepository.save( category );
      
      return this.findOne( id );

    } catch ( error ) {
      handleDBErrors( error, 'update - categories' );
    }
  }

  async remove(id: number) {
    await this.findOne( id );

    try {
      await this.categoryRepository.update( id, { isDeleted: true } );

      return {
        message: `Category with id: ${ id } is removed successfully`
      }

    } catch ( error ) {
      handleDBErrors( error, 'remove - categories' );
    }
  }
}
