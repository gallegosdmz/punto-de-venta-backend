import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { LoginUserDto } from "../dto/login-user.dto";
import { Auth } from "../decorators/auth.decorator";
import { ValidRoles } from "../interfaces/valid-roles";
import { GetUser } from "../decorators/get-user.decorator";
import { User } from "../entities/user.entity";
import { ChangePasswordDto } from "../dto/change-password.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    login( @Body() loginUserDto: LoginUserDto ) {
      return this.authService.login( loginUserDto );
    }

    @Get('check-auth-status')
    @Auth(ValidRoles.administrator, ValidRoles.ceo, ValidRoles.assistant)
    checkAuthStatus(
      @GetUser() user: User,
    ) {
      return this.authService.checkAuthStatus( user );
    }

    @Patch('password-change/:id')
    @Auth(ValidRoles.administrator, ValidRoles.ceo)
    changePassword(
      @Param('id', ParseIntPipe ) id: number,
      @Body() changuePasswordDto: ChangePasswordDto,
      @GetUser() user: User
    ) {
      return this.authService.changePassword(+id, changuePasswordDto, user);
    }
}