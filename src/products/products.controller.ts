import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth } from 'src/users/decorators/auth.decorator';
import { ValidRoles } from 'src/users/interfaces/valid-roles';
import { GetUser } from 'src/users/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth( ValidRoles.administrador )
  create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @Auth( ValidRoles.administrador, ValidRoles.cajero )
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @Auth( ValidRoles.administrador, ValidRoles.cajero )
  findOne(@Param('id', ParseIntPipe ) id: number) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @Auth( ValidRoles.administrador )
  update(@Param('id', ParseIntPipe ) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @Auth( ValidRoles.administrador )
  remove(@Param('id', ParseIntPipe ) id: number) {
    return this.productsService.remove(+id);
  }
}
