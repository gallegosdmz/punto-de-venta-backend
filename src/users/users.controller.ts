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
  @Auth( ValidRoles.administrador )
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  login( @Body() loginUserDto: LoginUserDto ) {
    return this.usersService.login( loginUserDto );
  }

  @Get()
  @Auth( ValidRoles.administrador )
  findAll() {
    return this.usersService.findAll();
  }

  @Get('check-auth-status')
  @Auth( ValidRoles.administrador, ValidRoles.cajero )
  checkAuthStatus(
    @GetUser() user: User,
  ) {
    return this.usersService.checkAuthStatus( user );
  }

  @Get(':id')
  @Auth( ValidRoles.administrador )
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @Auth( ValidRoles.administrador )
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Patch('changue-password/:id')
  @Auth( ValidRoles.administrador )
  changePassword(
    @Param('id', ParseIntPipe ) id: number,
    @Body() changuePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword( +id, changuePasswordDto );
  }

  @Delete(':id')
  @Auth( ValidRoles.administrador )
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(+id);
  }
}
