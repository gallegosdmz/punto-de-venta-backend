import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Auth } from 'src/users/decorators/auth.decorator';
import { ValidRoles } from 'src/users/interfaces/valid-roles';
import { GetUser } from 'src/users/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Auth(ValidRoles.administrator, ValidRoles.ceo, ValidRoles.assistant)
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @GetUser() user: User
  ) {
    return this.categoriesService.create(createCategoryDto, user);
  }

  @Get()
  @Auth( ValidRoles.administrator, ValidRoles.ceo, ValidRoles.assistant )
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get('find-all-by-business')
  @Auth(ValidRoles.administrator, ValidRoles.ceo, ValidRoles.assistant)
  findAllByBusiness(
    @GetUser() user: User
  ) {
    return this.categoriesService.findAllByBusiness(user);
  }

  @Get(':id')
  @Auth( ValidRoles.administrator, ValidRoles.ceo, ValidRoles.assistant )
  findOne(
    @Param('id', ParseIntPipe ) id: number,
    @GetUser() user: User
  ) {
    return this.categoriesService.findOne(+id, user);
  }

  @Patch(':id')
  @Auth( ValidRoles.administrator, ValidRoles.ceo, ValidRoles.assistant )
  update(
    @Param('id', ParseIntPipe ) id: number, 
    @Body() updateCategoryDto: UpdateCategoryDto,
    @GetUser() user: User
  ) {
    return this.categoriesService.update(+id, updateCategoryDto, user);
  }

  @Delete(':id')
  @Auth( ValidRoles.administrator, ValidRoles.ceo )
  remove(
    @Param('id', ParseIntPipe ) id: number, 
    @GetUser() user: User
  ) {
    return this.categoriesService.remove(+id, user);
  }
}
