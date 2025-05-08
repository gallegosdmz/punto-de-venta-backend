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
  @Auth( ValidRoles.administrator, ValidRoles.ceo, ValidRoles.assistant )
  create(
    @Body() createSaleDto: CreateSaleDto,
    @GetUser() user: User
  ) {
    return this.salesService.create(createSaleDto, user);
  }

  @Get()
  @Auth( ValidRoles.administrator )
  findAll() {
    return this.salesService.findAll();
  }

  @Get('find-all-by-business')
  @Auth(ValidRoles.administrator, ValidRoles.ceo)
  findAllByBusiness(
    @GetUser() user: User
  ) {
    return this.salesService.findAllByBusiness(user);
  }

  @Get(':id')
  @Auth( ValidRoles.administrator, ValidRoles.ceo )
  findOne(
    @Param('id', ParseIntPipe ) id: number,
    @GetUser() user: User
  ) {
    return this.salesService.findOne(+id, user);
  }

  @Delete(':id')
  @Auth( ValidRoles.administrator, ValidRoles.ceo )
  remove(
    @Param('id', ParseIntPipe ) id: number,
    @GetUser() user: User
  ) {
    return this.salesService.remove(+id, user);
  }
}
