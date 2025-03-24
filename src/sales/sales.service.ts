import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { Between, DataSource, Repository } from 'typeorm';
import { SaleDetail } from './entities/sale-detail.entity';
import { User } from 'src/users/entities/user.entity';
import { CustomValidations } from 'src/utils/validations';
import { handleDBErrors } from 'src/utils/errors';
import { ProductsService } from 'src/products/products.service';
import { GenerateDailyReportDto } from './dto/generate-daily-report.dto';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository( Sale )
    private readonly saleRepository: Repository<Sale>,

    @InjectRepository( SaleDetail )
    private readonly saleDetailRepository: Repository<SaleDetail>,
    private readonly customValidations: CustomValidations,

    private readonly productsService: ProductsService,

    private readonly dataSource: DataSource,
  ) {}

  async create(createSaleDto: CreateSaleDto, user: User) {
    await this.customValidations.verifyEntityExist( User, user.id );

    const { details, ...dataSale } = createSaleDto; 

    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();    

    try {
      const sale = this.saleRepository.create({
        ...dataSale ,
        user,
      });
      await queryRunner.manager.save( sale );

      for (const x of details) {
        const { product, ...detail } = x;
        const productDB = await this.productsService.findOne(product);

        const saleDetail = this.saleDetailRepository.create({
            ...detail,
            sale: sale,
            product: productDB
        });
        await queryRunner.manager.save(saleDetail);

        console.log(saleDetail);
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

  async findOne(id: number) {
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

    return sale;
  }

  async generateDailyReport( dateSale: Date ) {
    if ( !dateSale ) throw new BadRequestException('dateSale is required');
    
    const date = new Date( dateSale );
    if ( isNaN( date.getTime() ) ) throw new BadRequestException('Invalid date format');

    try {
      const sales = await this.saleRepository.find({
        where: {
          dateSale: dateSale,
          isDeleted: false,
        },
        relations: {
          saleDetails: {
            product: true,
          },
          user: true,
        },
      });

      if ( !sales ) throw new NotFoundException(`Sales with: ${ dateSale } not found`);

      return sales;

    } catch ( error ) {
      handleDBErrors( error, 'generateDailyReport - sales' );
    }
  }

  async generateMonthlyReport( month: number ) {
    if ( !month ) throw new BadRequestException('month is required');
    if ( isNaN( Number( month ) ) ) throw new BadRequestException('Invalid month');
    if (month < 1 || month > 12) throw new BadRequestException('Month must be between 1 and 12');

    try {
      // Calcular el primer y último día del mes
      const firstDayOfMonth = new Date(new Date().getFullYear(), month - 1, 1); // El primer día del mes
      const lastDayOfMonth = new Date(new Date().getFullYear(), month, 0); // El último día del mes

      const sales = await this.saleRepository.find({
        where: {
          dateSale: Between(firstDayOfMonth, lastDayOfMonth),
          isDeleted: false,
        },
        relations: {
          saleDetails: {
            product: true,
          },
          user: true,
        },
      });
      if ( !sales ) throw new NotFoundException(`Sales in month: ${ month } not found`);

      return sales;

    } catch ( error ) {
      handleDBErrors( error, 'generateMonthlyReport - sales' );
    }
  }

  async generateReport(periodType: string, period: number) {
    if (!period) throw new BadRequestException('Period is required');
    if (isNaN(Number(period))) throw new BadRequestException('Invalid period');
    
    // Validación de tipos de periodo
    const validPeriodTypes = ['bimestre', 'trimestre', 'semestre'];
    if (!validPeriodTypes.includes(periodType)) {
      throw new BadRequestException(`Invalid period type. Valid values are ${validPeriodTypes.join(', ')}`);
    }
  
    try {
      // Calcular las fechas según el tipo de periodo
      let startDate: Date, endDate: Date;
  
      const currentYear = new Date().getFullYear();
  
      if (periodType === 'bimestre') {
        // Para bimestres, cada bimestre tiene 2 meses.
        if (period < 1 || period > 6) throw new BadRequestException('Bimestre must be between 1 and 6');
        
        const startMonth = (period - 1) * 2;
        const endMonth = startMonth + 1;
  
        startDate = new Date(currentYear, startMonth, 1); // Primer día del bimestre
        endDate = new Date(currentYear, endMonth + 1, 0); // Último día del bimestre
  
      } else if (periodType === 'trimestre') {
        // Para trimestres, cada trimestre tiene 3 meses.
        if (period < 1 || period > 4) throw new BadRequestException('Trimestre must be between 1 and 4');
  
        const startMonth = (period - 1) * 3;
        const endMonth = startMonth + 2;
  
        startDate = new Date(currentYear, startMonth, 1); // Primer día del trimestre
        endDate = new Date(currentYear, endMonth + 1, 0); // Último día del trimestre
  
      } else if (periodType === 'semestre') {
        // Para semestres, cada semestre tiene 6 meses.
        if (period < 1 || period > 2) throw new BadRequestException('Semestre must be between 1 and 2');
  
        const startMonth = (period - 1) * 6;
        const endMonth = startMonth + 5;
  
        startDate = new Date(currentYear, startMonth, 1); // Primer día del semestre
        endDate = new Date(currentYear, endMonth + 1, 0); // Último día del semestre
      }
  
      // Obtener todas las ventas en el rango de fechas
      const sales = await this.saleRepository.find({
        where: {
          dateSale: Between(startDate!, endDate!),
        },
      });
  
      return sales;
  
    } catch (error) {
      handleDBErrors(error, 'generateReport - sales');
    }
  }

  async remove(id: number) {
    await this.findOne( id );

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
