import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { handleDBErrors } from 'src/utils/errors';
import { CustomValidations } from 'src/utils/validations';
import { User } from 'src/users/entities/user.entity';
import { RestockProductDto } from './dto/restock-product.dto';
import { Category } from 'src/categories/entities/category.entity';
import { Supplier } from 'src/suppliers/entities/supplier.entity';
import { ExpensesService } from 'src/expenses/expenses.service';
import { CreateExpenseDto } from 'src/expenses/dto/create-expense.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository( Product )
    private readonly productRepository: Repository<Product>,
    private readonly customValidations: CustomValidations,
    private readonly expenseService: ExpensesService,
  ) {}
  
  async create(createProductDto: CreateProductDto, user: User) {
    const category = await this.customValidations.verifyEntityExist( Category, createProductDto.category );
    const supplier = await this.customValidations.verifyEntityExist( Supplier, createProductDto.supplier );

    try {
      const product = this.productRepository.create({
        ...createProductDto,
        category,
        user,
        supplier
      });
      await this.productRepository.save( product );

      const expense: CreateExpenseDto = {
        concept: `Gasto por abastecimiento de producto: ${ createProductDto.name }`,
        total: Number( product.purchasePrice * product.stock ),
      }
      await this.expenseService.create( expense );

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
        relations: {
          category: true,
          user: true,
          supplier: true,
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
      relations: {
        category: true,
        user: true,
        supplier: true,
      },
    });
    if ( !product ) throw new NotFoundException(`Product with id: ${ id } not found`);

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne( id );
    
    const category = await this.customValidations.verifyEntityExist( Category, updateProductDto.category! );
    const supplier = await this.customValidations.verifyEntityExist( Supplier, updateProductDto.supplier! );

    const { stock, ...res } = updateProductDto;

    const data = {
      ...res,
      category,
      supplier
    };

    try {
      Object.assign( product, data );
      await this.productRepository.save( product );

      return this.findOne( id );

    } catch ( error ) {
      handleDBErrors( error, 'update - products' );
    }
  }

  async restock( id: number, restockProductDto: RestockProductDto ) {
    const product = await this.findOne( id );
    const restock = Number( product.stock + restockProductDto.restock );

    try {
      await this.productRepository.update( id, { stock: restock });

      const expense: CreateExpenseDto = {
        concept: `Gasto por reabastecimiento de producto: ${ product.name }`,
        total: Number( product.purchasePrice * restock ),
      }
      await this.expenseService.create( expense );

      return this.findOne( id );

    } catch ( error ) {
      handleDBErrors( error, 'restock - products' );
    }
  }
  
  async decrementStock( id: number, stock: number ) {
    const product = await this.findOne( id );
    const decrement = Number( product.stock - stock );

    try {
      await this.productRepository.update( id, { stock: decrement });

      return this.findOne( id );

    } catch ( error ) {
      handleDBErrors( error, 'decrementStoc - products' );
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
