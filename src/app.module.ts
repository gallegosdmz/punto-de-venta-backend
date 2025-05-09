import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { SuppliersModule } from './suppliers/suppliers.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { ExpensesModule } from './expenses/expenses.module';
import { SalesModule } from './sales/sales.module';
import { BusinessesModule } from './businesses/businesses.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    SuppliersModule,
    CategoriesModule,
    ProductsModule,
    ExpensesModule,
    SalesModule,
    BusinessesModule,
    CoreModule,
  ],
})
export class AppModule {}
