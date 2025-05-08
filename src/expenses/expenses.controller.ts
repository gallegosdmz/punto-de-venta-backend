import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Auth } from 'src/users/decorators/auth.decorator';
import { ValidRoles } from 'src/users/interfaces/valid-roles';
import { GetUser } from 'src/users/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @Auth( ValidRoles.administrator, ValidRoles.ceo )
  create(
    @Body() createExpenseDto: CreateExpenseDto,
    @GetUser() user: User
  ) {
    return this.expensesService.create(createExpenseDto, user);
  }

  @Get()
  @Auth( ValidRoles.administrator )
  findAll() {
    return this.expensesService.findAll();
  }

  @Get('find-all-by-business')
  @Auth(ValidRoles.administrator, ValidRoles.ceo)
  findAllByBusiness(
    @GetUser() user: User
  ) {
    return this.expensesService.findAllByBusiness(user);
  }

  @Get(':id')
  @Auth( ValidRoles.administrator )
  findOne(
    @Param('id', ParseIntPipe ) id: number,
    @GetUser() user: User,
  ) {
    return this.expensesService.findOne(+id, user);
  }

  @Patch(':id')
  @Auth( ValidRoles.administrator, ValidRoles.ceo )
  update(
    @Param('id', ParseIntPipe ) id: number,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @GetUser() user: User
  ) {
    return this.expensesService.update(+id, updateExpenseDto, user);
  }

  @Delete(':id')
  @Auth( ValidRoles.administrator, ValidRoles.ceo )
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User
  ) {
    return this.expensesService.remove(+id, user);
  }
}
