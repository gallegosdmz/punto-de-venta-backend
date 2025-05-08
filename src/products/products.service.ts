import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { handleDBErrors } from 'src/utils/errors';
import { CustomValidator } from 'src/utils/validations';
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
    private readonly customValidator: CustomValidator,
    private readonly expenseService: ExpensesService,
  ) {}
  
  async create(createProductDto: CreateProductDto, user: User) {
    const category = await this.customValidator.verifyEntityExist( Category, createProductDto.category );
    const supplier = await this.customValidator.verifyEntityExist( Supplier, createProductDto.supplier );

    const business = await this.customValidator.verifyOwnerBusiness(user.business.id, user);

    const {expense, ...createProductDetails} = createProductDto;

    try {
      const product = this.productRepository.create({
        ...createProductDetails,
        category,
        user,
        supplier,
        business,
      });
      await this.productRepository.save( product );

      const expenseData = {
        concept: `Gasto por abastecimiento de producto: ${ createProductDto.name }`,
        expCategory: expense.expCategory,
        method: expense.method,
        total: Number( product.purchasePrice * product.stock ),
        business,
      }
      await this.expenseService.create( expenseData, user );

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
          business: true,
        },
      });

      return products;

    } catch ( error ) {
      handleDBErrors( error, 'findAll - products' );
    }
  }

  async findAllByBusiness(user: User) {
    const business = await this.customValidator.verifyOwnerBusiness(user.business.id, user);

    try {
      const products = await this.productRepository.find({
        where: {
          isDeleted: false,
          business,
        },
        relations: {
          category: true,
          supplier: true,
          user: true,
        },
      });

      return products;

    } catch (error) {
      handleDBErrors(error, 'findAllByBusiness - products');
    }
  }

  async findOne(id: number, user: User) {
    const product = await this.productRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
      relations: {
        category: true,
        user: true,
        supplier: true,
        business: true,
      },
    });
    if ( !product ) throw new NotFoundException(`Product with id: ${ id } not found`);
    await this.customValidator.verifyOwnerBusiness(product.business.id, user)

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto, user: User) {
    const product = await this.findOne(id, user);
    
    const category = await this.customValidator.verifyEntityExist( Category, updateProductDto.category! );
    const supplier = await this.customValidator.verifyEntityExist( Supplier, updateProductDto.supplier! );

    const { stock, ...res } = updateProductDto;

    const data = {
      ...res,
      category,
      supplier
    };

    try {
      const updatedProduct = this.productRepository.create({
        ...product,
        ...data,
      });
      await this.productRepository.save( updatedProduct );

      return this.findOne(id, user);

    } catch ( error ) {
      handleDBErrors( error, 'update - products' );
    }
  }

  async restock(id: number, restockProductDto: RestockProductDto, user: User) {
    const business = await this.customValidator.verifyOwnerBusiness(user.business.id, user);
    const product = await this.findOne(id, user);
    const restock = Number( product.stock + restockProductDto.restock );

    try {
      await this.productRepository.update( id, { stock: restock });

      const expenseData = {
        concept: `Gasto por reabastecimiento de producto: ${ product.name }`,
        expCategory: restockProductDto.expense.expCategory,
        method: restockProductDto.expense.method,
        total: Number( product.purchasePrice * restock ),
        business,
      }
      await this.expenseService.create( expenseData, user );

      return this.findOne(id, user);

    } catch ( error ) {
      handleDBErrors( error, 'restock - products' );
    }
  }
  
  async decrementStock(id: number, stock: number, user: User) {
    const product = await this.findOne(id, user);
    const decrement = Number( product.stock - stock );

    try {
      await this.productRepository.update( id, { stock: decrement });

      return this.findOne(id, user);

    } catch ( error ) {
      handleDBErrors( error, 'decrementStoc - products' );
    }
  }

  async remove(id: number, user: User) {
    await this.findOne(id, user);

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
