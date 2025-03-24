import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { Repository } from 'typeorm';
import { handleDBErrors } from 'src/utils/errors';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository( Expense )
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  async create(createExpenseDto: CreateExpenseDto) {
    try {
      const expense = this.expenseRepository.create( createExpenseDto );
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
      });

      return expenses;

    } catch ( error ) {
      handleDBErrors( error, 'findAll - expenses' );
    }
  }

  async findOne(id: number) {
    const expense = await this.expenseRepository.findOne({
      where: { id, isDeleted: false },
    });
    if ( !expense ) throw new NotFoundException(`Expense with id: ${ id } not found`);

    return expense;
  }

  async update(id: number, updateExpenseDto: UpdateExpenseDto) {
    const expense = await this.findOne( id );

    try {
      Object.assign( expense, updateExpenseDto );
      await this.expenseRepository.save( expense );

      return this.findOne( id );

    } catch ( error ) {
      handleDBErrors( error, 'update - expenses' );
    }
  }

  async remove(id: number) {
    await this.findOne( id );

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
