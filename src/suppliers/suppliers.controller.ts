import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Auth } from 'src/users/decorators/auth.decorator';
import { ValidRoles } from 'src/users/interfaces/valid-roles';
import { GetUser } from 'src/users/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {
  }

  @Post()
  @Auth(ValidRoles.administrator, ValidRoles.ceo)
  create(
    @Body() createSupplierDto: CreateSupplierDto,
    @GetUser() user: User
  ) {
    return this.suppliersService.create(createSupplierDto, user);
  }

  @Get()
  @Auth(ValidRoles.administrator)
  findAll() {
    return this.suppliersService.findAll();
  }

  @Get('find-all-by-business')
  @Auth(ValidRoles.administrator, ValidRoles.ceo, ValidRoles.assistant)
  findAllByBusiness(
    @GetUser() user: User
  ) {
    return this.suppliersService.findAllByBusiness(user);
  }

  @Get(':id')
  @Auth(ValidRoles.administrator, ValidRoles.ceo, ValidRoles.assistant)
  findOne(
    @Param('id', ParseIntPipe ) id: number,
    @GetUser() user: User
  ) {
    return this.suppliersService.findOne(+id, user);
  }

  @Patch(':id')
  @Auth(ValidRoles.administrator, ValidRoles.ceo)
  update(
    @Param('id', ParseIntPipe ) id: number,
    @Body() updateSupplierDto: UpdateSupplierDto,
    @GetUser() user: User
  ) {
    return this.suppliersService.update(+id, updateSupplierDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.administrator, ValidRoles.ceo)
  remove(
    @Param('id', ParseIntPipe ) id: number,
    @GetUser() user: User
  ) {
    return this.suppliersService.remove(+id, user);
  }
}
