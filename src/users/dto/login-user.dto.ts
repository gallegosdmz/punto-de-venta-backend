import { IsString } from "class-validator";
import { IsPassword } from "../decorators";

export class LoginUserDto {
    @IsString()
    userName: string;

    @IsString()
    @IsPassword()
    password: string;
}