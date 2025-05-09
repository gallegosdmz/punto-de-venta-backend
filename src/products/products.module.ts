import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { UsersModule } from 'src/users/users.module';
import { ExpensesModule } from 'src/expenses/expenses.module';
import { BusinessesModule } from 'src/businesses/businesses.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([ Product ]),
    UsersModule,
    ExpensesModule,
    BusinessesModule,
  ],
  exports: [ProductsService]
})
export class ProductsModule {}
