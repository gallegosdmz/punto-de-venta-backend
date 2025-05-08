import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { Repository } from 'typeorm';
import { handleDBErrors } from 'src/utils/errors';
import { CustomValidator } from 'src/utils/validations';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository( Expense )
    private readonly expenseRepository: Repository<Expense>,
    private readonly customValidator: CustomValidator,
  ) {}

  async create(createExpenseDto: CreateExpenseDto, user: User) {
    const business = await this.customValidator.verifyOwnerBusiness(user.business.id, user);
    
    try {
      const expense = this.expenseRepository.create({ ...createExpenseDto, business });
      await this.expenseRepository.save( expense );

      return expense;

    } catch ( error ) {
      handleDBErrors( error, 'create - expenses' );
    }
  }

  async findAll() {
    try {
      const expenses = await this.expenseRepository.find({
        where: { isDeleted: false },
        relations: {
          business: true,
        },
      });

      return expenses;

    } catch ( error ) {
      handleDBErrors( error, 'findAll - expenses' );
    }
  }

  async findAllByBusiness(user: User) {
    const business = await this.customValidator.verifyOwnerBusiness(user.business.id, user);

    try {
      const expenses = await this.expenseRepository.find({
        where: {
          isDeleted: false,
          business
        },
      });

      return expenses;

    } catch (error) {
      handleDBErrors(error, 'findAllByBusiness - expenses');
    }
  }

  async findOne(id: number, user: User) {
    const expense = await this.expenseRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!expense) throw new NotFoundException(`Expense with id: ${ id } not found`);
    await this.customValidator.verifyOwnerBusiness(expense.business.id, user);

    return expense;
  }

  async update(id: number, updateExpenseDto: UpdateExpenseDto, user: User) {
    const expense = await this.findOne(id, user);

    try {
      const updatedExpense = this.expenseRepository.create({
        ...expense,
        ...updateExpenseDto,
      });
      await this.expenseRepository.save( updatedExpense );

      return this.findOne(id, user);

    } catch ( error ) {
      handleDBErrors( error, 'update - expenses' );
    }
  }

  async remove(id: number, user: User) {
    await this.findOne(id, user);

    try {
      await this.expenseRepository.update( id, { isDeleted: true } );

      return {
        message: `Expense with id: ${ id } is removed successfully`
      }

    } catch ( error ) {
      handleDBErrors( error, 'remove - expenses' );
    }
  }
}
