import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth } from 'src/users/decorators/auth.decorator';
import { ValidRoles } from 'src/users/interfaces/valid-roles';
import { GetUser } from 'src/users/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { RestockProductDto } from './dto/restock-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth(ValidRoles.administrator, ValidRoles.ceo, ValidRoles.assistant)
  create(
    @Body() createProductDto: CreateProductDto, 
    @GetUser() user: User
  ) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @Auth(ValidRoles.administrator)
  findAll() {
    return this.productsService.findAll();
  }

  @Get('find-all-by-business')
  @Auth(ValidRoles.administrator, ValidRoles.ceo, ValidRoles.assistant)
  findAllByBusiness(
    @GetUser() user: User
  ) {
    return this.productsService.findAllByBusiness(user);
  }

  @Get(':id')
  @Auth(ValidRoles.administrator, ValidRoles.ceo, ValidRoles.assistant)
  findOne(
    @Param('id', ParseIntPipe ) id: number,
    @GetUser() user: User
  ) {
    return this.productsService.findOne(+id, user);
  }

  @Patch(':id')
  @Auth(ValidRoles.administrator, ValidRoles.ceo)
  update(
    @Param('id', ParseIntPipe ) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User
  ) {
    return this.productsService.update(+id, updateProductDto, user);
  }

  @Patch('restock/:id')
  @Auth(ValidRoles.administrator, ValidRoles.ceo, ValidRoles.assistant)
  restock(
    @Param('id', ParseIntPipe ) id: number,
    @Body() restockProductDto: RestockProductDto,
    @GetUser() user: User
  ) {
    return this.productsService.restock(+id, restockProductDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.administrator, ValidRoles.ceo)
  remove(
    @Param('id', ParseIntPipe ) id: number,
    @GetUser() user: User
  ) {
    return this.productsService.remove(+id, user);
  }
}
