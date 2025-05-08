import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { UsersModule } from 'src/users/users.module';
import { SaleDetail } from './entities/sale-detail.entity';
import { CustomValidator } from 'src/utils/validations';
import { ProductsModule } from 'src/products/products.module';

@Module({
  controllers: [SalesController],
  providers: [SalesService, CustomValidator],
  imports: [
    TypeOrmModule.forFeature([ Sale, SaleDetail ]),
    UsersModule,
    ProductsModule,
  ]
})
export class SalesModule {}
