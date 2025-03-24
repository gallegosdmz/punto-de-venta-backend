import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Auth } from 'src/users/decorators/auth.decorator';
import { ValidRoles } from 'src/users/interfaces/valid-roles';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @Auth( ValidRoles.administrador, ValidRoles.cajero )
  create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.create(createExpenseDto);
  }

  @Get()
  @Auth( ValidRoles.administrador )
  findAll() {
    return this.expensesService.findAll();
  }

  @Get(':id')
  @Auth( ValidRoles.administrador )
  findOne(@Param('id', ParseIntPipe ) id: number) {
    return this.expensesService.findOne(+id);
  }


  @Patch(':id')
  @Auth( ValidRoles.administrador )
  update(@Param('id', ParseIntPipe ) id: number, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expensesService.update(+id, updateExpenseDto);
  }

  @Delete(':id')
  @Auth( ValidRoles.administrador )
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.expensesService.remove(+id);
  }
}
