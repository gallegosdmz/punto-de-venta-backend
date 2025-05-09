import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { UsersModule } from 'src/users/users.module';
import { BusinessesModule } from 'src/businesses/businesses.module';

@Module({
  controllers: [SuppliersController],
  providers: [SuppliersService],
  imports: [
    TypeOrmModule.forFeature([ Supplier ]),
    UsersModule,
    BusinessesModule,
  ]
})
export class SuppliersModule {}
