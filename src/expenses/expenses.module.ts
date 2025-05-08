import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { UsersModule } from 'src/users/users.module';
import { CustomValidator } from 'src/utils/validations';

@Module({
  controllers: [ExpensesController],
  providers: [ExpensesService, CustomValidator],
  imports: [
    TypeOrmModule.forFeature([ Expense ]),
    UsersModule,
  ],
  exports: [ExpensesService]
})
export class ExpensesModule {}
