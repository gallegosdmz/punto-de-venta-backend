import { Module } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { BusinessesController } from './businesses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from './entities/business.entity';
import { UsersModule } from 'src/users/users.module';
import { CustomValidator } from 'src/utils/validations';

@Module({
  controllers: [BusinessesController],
  providers: [BusinessesService, CustomValidator],
  imports: [
    TypeOrmModule.forFeature([Business]),
    UsersModule,
  ]
})
export class BusinessesModule {}
