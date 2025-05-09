import {  Injectable, NotFoundException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { DataSource, Repository } from 'typeorm';
import { SaleDetail } from './entities/sale-detail.entity';
import { User } from 'src/users/entities/user.entity';
import { handleDBErrors } from 'src/utils/errors';
import { ProductsService } from 'src/products/products.service';
import { BusinessValidator } from 'src/businesses/validators/business.validator';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository( Sale )
    private readonly saleRepository: Repository<Sale>,

    @InjectRepository( SaleDetail )
    private readonly saleDetailRepository: Repository<SaleDetail>,
    private readonly businessValidator: BusinessValidator,

    private readonly productsService: ProductsService,

    private readonly dataSource: DataSource,
  ) {}

  async create(createSaleDto: CreateSaleDto, user: User) {
    const business = await this.businessValidator.verifyOwnerBusiness(user.business.id, user);

    const { details, ...dataSale } = createSaleDto; 

    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();    

    try {
      const sale = this.saleRepository.create({
        ...dataSale ,
        user,
        business,
      });
      await queryRunner.manager.save( sale );

      for (const x of details) {
        const { product, ...detail } = x;
        const productDB = await this.productsService.findOne(product, user);

        // Decrementar stock en el producto
        await this.productsService.decrementStock(product, detail.quantity, user);

        const saleDetail = this.saleDetailRepository.create({
            ...detail,
            sale: sale,
            product: productDB
        });
        await queryRunner.manager.save(saleDetail);
      }

      await queryRunner.commitTransaction();

      return sale;

    } catch ( error ) {
      await queryRunner.rollbackTransaction();

      handleDBErrors( error, 'create - sales' );

    } finally {
      await queryRunner.release();
      
    }
  }

  async findAll() {
    try {
      const sales = await this.saleRepository.find({
        where: {
          isDeleted: false,
        },
        relations: {
          saleDetails: {
            product: true,
          },
          user: true,
        },
      });

      return sales;

    } catch ( error ) {
      handleDBErrors( error, 'findAll - sales' );
    }
  }

  async findAllByBusiness(user: User) {
    const business = await this.businessValidator.verifyOwnerBusiness(user.business.id, user);

    try {
      const sales = await this.saleRepository.find({
        where: {
          isDeleted: false,
          business,
        },
        relations: {
          saleDetails: {
            product: true,
          },
          user: true,
        },
      });

      return sales;

    } catch (error) {
      handleDBErrors(error, 'findAllByBusiness - sales');
    }
  }

  async findOne(id: number, user: User) {
    const sale = await this.saleRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
      relations: {
        saleDetails: {
          product: true,
        },
        user: true,
      },
    });
    if ( !sale ) throw new NotFoundException(`Sale with id: ${ id } not found`);
    await this.businessValidator.verifyOwnerBusiness(sale.business.id, user);

    return sale;
  }

  async remove(id: number, user: User) {
    await this.findOne( id, user );

    // Validación para saber si una venta ya pasó por corte

    try {
      await this.saleRepository.update( id, { isDeleted: false } );

      return {
        message: `Sale with id: ${ id } is removed successfully`
      }

    } catch ( error ) {
      handleDBErrors( error, 'remove - sales' );
    }
  }

}
