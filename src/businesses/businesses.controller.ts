import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Auth } from 'src/users/decorators/auth.decorator';
import { ValidRoles } from 'src/users/interfaces/valid-roles';

@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Post()
  @Auth(ValidRoles.administrator)
  create(@Body() createBusinessDto: CreateBusinessDto) {
    return this.businessesService.create(createBusinessDto);
  }

  @Get()
  @Auth(ValidRoles.administrator)
  findAll() {
    return this.businessesService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.administrator)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.businessesService.findOne(+id);
  }

  @Patch(':id')
  @Auth(ValidRoles.administrator)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateBusinessDto: UpdateBusinessDto) {
    return this.businessesService.update(+id, updateBusinessDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.administrator)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.businessesService.remove(+id);
  }
}
