import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { UsersModule } from 'src/users/users.module';
import { CustomValidations } from 'src/utils/validations';

@Module({
  controllers: [SuppliersController],
  providers: [SuppliersService, CustomValidations],
  imports: [
    TypeOrmModule.forFeature([ Supplier ]),
    UsersModule,
  ]
})
export class SuppliersModule {}
