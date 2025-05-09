import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { UsersModule } from 'src/users/users.module';
import { BusinessesModule } from 'src/businesses/businesses.module';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [
    TypeOrmModule.forFeature([ Category ]),
    UsersModule,
    BusinessesModule,
  ]
})
export class CategoriesModule {}
