import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, ParseDatePipe } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { GetUser } from 'src/users/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Auth } from 'src/users/decorators/auth.decorator';
import { ValidRoles } from 'src/users/interfaces/valid-roles';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @Auth( ValidRoles.administrador, ValidRoles.cajero )
  create(@Body() createSaleDto: CreateSaleDto, @GetUser() user: User) {
    return this.salesService.create(createSaleDto, user);
  }

  @Get()
  @Auth( ValidRoles.administrador, ValidRoles.cajero )
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  @Auth( ValidRoles.administrador, ValidRoles.cajero )
  findOne(@Param('id', ParseIntPipe ) id: number) {
    return this.salesService.findOne(+id);
  }

  @Get('daily-report/:dateSale')
  @Auth( ValidRoles.administrador )
  generateDailyReport(
    @Param('dateSale') dateSale: Date
  ) {
    return this.salesService.generateDailyReport( dateSale );
  }

  @Get('monthly-report/:month')
  @Auth( ValidRoles.administrador )
  generateMonthlyReport(
    @Param('month', ParseIntPipe ) month: number
  ) {
    return this.salesService.generateMonthlyReport( +month );
  }

  @Delete(':id')
  @Auth( ValidRoles.administrador )
  remove(@Param('id', ParseIntPipe ) id: number) {
    return this.salesService.remove(+id);
  }
}
