import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { UsersModule } from 'src/users/users.module';
import { CustomValidations } from 'src/utils/validations';
import { ExpensesModule } from 'src/expenses/expenses.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, CustomValidations],
  imports: [
    TypeOrmModule.forFeature([ Product ]),
    UsersModule,
    ExpensesModule,
  ],
  exports: [ProductsService]
})
export class ProductsModule {}
