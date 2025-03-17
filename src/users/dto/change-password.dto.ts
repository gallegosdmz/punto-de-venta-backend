import { IsString } from "class-validator";
import { IsPassword } from "../decorators";

export class ChangePasswordDto {
    @IsString()
    @IsPassword()
    password: string;
}