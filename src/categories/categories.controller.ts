import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Auth } from 'src/users/decorators/auth.decorator';
import { ValidRoles } from 'src/users/interfaces/valid-roles';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Auth( ValidRoles.administrador )
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @Auth( ValidRoles.administrador, ValidRoles.cajero )
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @Auth( ValidRoles.administrador, ValidRoles.cajero )
  findOne(@Param('id', ParseIntPipe ) id: number) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  @Auth( ValidRoles.administrador )
  update(@Param('id', ParseIntPipe ) id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @Auth( ValidRoles.administrador )
  remove(@Param('id', ParseIntPipe ) id: number) {
    return this.categoriesService.remove(+id);
  }
}
