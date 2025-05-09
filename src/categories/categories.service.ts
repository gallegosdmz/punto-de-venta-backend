import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { handleDBErrors } from 'src/utils/errors';
import { User } from 'src/users/entities/user.entity';
import { BusinessValidator } from 'src/businesses/validators/business.validator';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository( Category )
    private readonly categoryRepository: Repository<Category>,
    private readonly businessValidator: BusinessValidator,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, user: User) {
    await this.businessValidator.verifyFieldNotRepeated( Category, 'name', createCategoryDto.name );
    const business = await this.businessValidator.verifyOwnerBusiness(user.business.id, user);

    try {
      const category = this.categoryRepository.create({
        ...createCategoryDto,
        business,
      });
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
          business: true,
        },
      });

      return categories;

    } catch ( error ) {
      handleDBErrors( error, 'findAll - categories' );
    }
  }

  async findAllByBusiness(user: User) {
    const business = await this.businessValidator.verifyOwnerBusiness(user.business.id, user);

    try {
      const categories = await this.categoryRepository.find({
        where: {
          isDeleted: false,
          business,
        },
        relations: {
          products: true,
        },
      });

      return categories;

    } catch (error) {
      handleDBErrors(error, 'findAllByBysiness - categories');
    }
  }

  async findOne(id: number, user: User) {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
      relations: {
        products: true,
        business: true,
      },
    });
    if ( !category ) throw new NotFoundException(`Category with id: ${ id } not found`);
    await this.businessValidator.verifyOwnerBusiness(category.business.id, user);

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto, user: User) {
    const category = await this.findOne(id, user);
    await this.businessValidator.verifyFieldNotRepeated( Category, 'name', updateCategoryDto.name, id );

    try {
      const updatedCategory = this.categoryRepository.create({
        ...category,
        ...updateCategoryDto,
      })
      await this.categoryRepository.save( updatedCategory );
      
      return this.findOne(id, user);

    } catch ( error ) {
      handleDBErrors( error, 'update - categories' );
    }
  }

  async remove(id: number, user: User) {
    await this.findOne(id, user);

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
