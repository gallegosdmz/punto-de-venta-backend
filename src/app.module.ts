import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { SuppliersModule } from './suppliers/suppliers.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { ExpensesModule } from './expenses/expenses.module';
import { SalesModule } from './sales/sales.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'tenciaventasdb',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    SuppliersModule,
    CategoriesModule,
    ProductsModule,
    ExpensesModule,
    SalesModule,
  ],
})
export class AppModule {}
