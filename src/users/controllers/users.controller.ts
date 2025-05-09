import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Auth } from '../decorators/auth.decorator';
import { ValidRoles } from '../interfaces/valid-roles';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Auth(ValidRoles.ceo)
  create(
    @Body() createUserDto: CreateUserDto, 
    @GetUser() user: User
  ) {
    return this.usersService.create(createUserDto, user);
  }

  @Get()
  @Auth(ValidRoles.ceo)
  findAll(
    @GetUser() user: User
  ) {
    return this.usersService.findAll(user);
  }

  @Get(':id')
  @Auth(ValidRoles.ceo)
  findOne(
    @Param('id', ParseIntPipe) id: number, 
    @GetUser() user: User
  ) {
    return this.usersService.findOne(+id, user);
  }

  @Patch(':id')
  @Auth(ValidRoles.ceo)
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: User
  ) {
    return this.usersService.update(+id, updateUserDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.ceo)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User
  ) {
    return this.usersService.remove(+id, user);
  }
}
