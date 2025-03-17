import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { handleDBErrors } from 'src/utils/errors';
import { CustomValidations } from 'src/utils/validations';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository( Product )
    private readonly productRepository: Repository<Product>,
    private readonly customValidations: CustomValidations,
  ) {}
  
  async create(createProductDto: CreateProductDto, user: User) {
    const category = await this.customValidations.verifyEntityExist( Product, createProductDto.category );
    const supplier = await this.customValidations.verifyEntityExist( Product, createProductDto.supplier );

    try {
      const product = this.productRepository.create({
        ...createProductDto,
        category,
        user,
        supplier
      });
      await this.productRepository.save( product );

      return product;

    } catch ( error ) {
      handleDBErrors( error, 'create - products');
    }
  }

  async findAll() {
    try {
      const products = await this.productRepository.find({
        where: {
          isDeleted: false,
        },
      });

      return products;

    } catch ( error ) {
      handleDBErrors( error, 'findAll - products' );
    }
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });
    if ( !product ) throw new NotFoundException(`Product with id: ${ id } not found`);

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne( id );
    
    const category = await this.customValidations.verifyEntityExist( Product, updateProductDto.category! );
    const supplier = await this.customValidations.verifyEntityExist( Product, updateProductDto.supplier! );

    try {
      Object.assign( product, updateProductDto );
      await this.productRepository.save( product );

      return this.findOne( id );

    } catch ( error ) {
      handleDBErrors( error, 'update - products' );
    }
  }

  async remove(id: number) {
    await this.findOne( id );

    try {
      await this.productRepository.update( id, { isDeleted: true } );

      return {
        message: `Product with id: ${ id } is removed successfully`
      }

    } catch ( error ) {
      handleDBErrors( error, 'remove - products' );
    }
  }
}
