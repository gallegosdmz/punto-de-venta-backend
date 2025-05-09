import { IsInt, IsOptional, IsString, MaxLength } from "class-validator";
import { IsPassword, IsRole } from "../decorators";
import { Type } from "class-transformer";

export class CreateUserDto {
    @IsString()
    @MaxLength(90)
    name: string;

    @IsString()
    @MaxLength(90)
    userName: string;

    @IsString()
    @IsPassword()
    password: string;

    @IsString()
    @IsRole()
    role: string;

    @IsInt()
    @IsOptional()
    @Type(() => Number)
    businessId?: number;
}
