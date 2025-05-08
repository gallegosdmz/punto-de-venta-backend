import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CustomValidator } from 'src/utils/validations';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, CustomValidator],
  imports: [
    TypeOrmModule.forFeature([ Category ]),
    UsersModule,
  ]
})
export class CategoriesModule {}
