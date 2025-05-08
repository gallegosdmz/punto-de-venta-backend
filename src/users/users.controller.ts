import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from './decorators/auth.decorator';
import { ValidRoles } from './interfaces/valid-roles';
import { LoginUserDto } from './dto/login-user.dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Auth(ValidRoles.administrator, ValidRoles.ceo)
  create(@Body() createUserDto: CreateUserDto, @GetUser() user: User) {
    return this.usersService.create(createUserDto, user);
  }

  @Post('login')
  login( @Body() loginUserDto: LoginUserDto ) {
    return this.usersService.login( loginUserDto );
  }

  @Get()
  @Auth(ValidRoles.administrator, ValidRoles.ceo)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('find-all-by-business')
  @Auth(ValidRoles.administrator, ValidRoles.ceo)
  findAllByBusiness(
    @GetUser() user: User
  ) {
    return this.usersService.findAllByBusiness(user);
  }

  @Get('check-auth-status')
  @Auth(ValidRoles.administrator, ValidRoles.ceo, ValidRoles.assistant)
  checkAuthStatus(
    @GetUser() user: User,
  ) {
    return this.usersService.checkAuthStatus( user );
  }

  @Get(':id')
  @Auth(ValidRoles.administrator, ValidRoles.ceo)
  findOne(
    @Param('id', ParseIntPipe) id: number, 
    @GetUser() user: User
  ) {
    return this.usersService.findOne(+id, user);
  }

  @Patch(':id')
  @Auth(ValidRoles.administrator, ValidRoles.ceo)
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: User
  ) {
    return this.usersService.update(+id, updateUserDto, user);
  }

  @Patch('changue-password/:id')
  @Auth(ValidRoles.administrator, ValidRoles.ceo)
  changePassword(
    @Param('id', ParseIntPipe ) id: number,
    @Body() changuePasswordDto: ChangePasswordDto,
    @GetUser() user: User
  ) {
    return this.usersService.changePassword(+id, changuePasswordDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.administrator, ValidRoles.ceo)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User
  ) {
    return this.usersService.remove(+id, user);
  }
}
