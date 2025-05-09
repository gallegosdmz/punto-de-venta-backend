import { forwardRef, Module } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { BusinessesController } from './businesses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from './entities/business.entity';
import { UsersModule } from 'src/users/users.module';
import { CoreModule } from 'src/core/core.module';
import { BusinessValidator } from './validators/business.validator';
import { CustomValidator } from 'src/utils/validations';

@Module({
  controllers: [BusinessesController],
  providers: [BusinessesService, BusinessValidator, CustomValidator],
  imports: [
    TypeOrmModule.forFeature([Business]),
    forwardRef(() => UsersModule),
    CoreModule,
  ],
  exports: [BusinessValidator],
})
export class BusinessesModule {}
