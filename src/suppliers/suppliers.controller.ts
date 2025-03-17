import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Auth } from 'src/users/decorators/auth.decorator';
import { ValidRoles } from 'src/users/interfaces/valid-roles';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {
  }

  @Post()
  @Auth( ValidRoles.administrador, ValidRoles.cajero )
  create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.suppliersService.create(createSupplierDto);
  }

  @Get()
  @Auth( ValidRoles.administrador, ValidRoles.cajero )
  findAll() {
    return this.suppliersService.findAll();
  }

  @Get(':id')
  @Auth( ValidRoles.administrador, ValidRoles.cajero )
  findOne(@Param('id', ParseIntPipe ) id: number) {
    return this.suppliersService.findOne(+id);
  }

  @Patch(':id')
  @Auth( ValidRoles.administrador )
  update(@Param('id', ParseIntPipe ) id: number, @Body() updateSupplierDto: UpdateSupplierDto) {
    return this.suppliersService.update(+id, updateSupplierDto);
  }

  @Delete(':id')
  @Auth( ValidRoles.administrador )
  remove(@Param('id', ParseIntPipe ) id: number) {
    return this.suppliersService.remove(+id);
  }
}
