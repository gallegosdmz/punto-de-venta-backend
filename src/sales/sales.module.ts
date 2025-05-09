import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { UsersModule } from 'src/users/users.module';
import { SaleDetail } from './entities/sale-detail.entity';
import { ProductsModule } from 'src/products/products.module';
import { BusinessesModule } from 'src/businesses/businesses.module';

@Module({
  controllers: [SalesController],
  providers: [SalesService],
  imports: [
    TypeOrmModule.forFeature([ Sale, SaleDetail ]),
    UsersModule,
    ProductsModule,
    BusinessesModule,
  ]
})
export class SalesModule {}
