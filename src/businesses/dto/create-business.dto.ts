import { IsEmail, IsString, MaxLength } from "class-validator";

export class CreateBusinessDto {
    @IsString()
    @MaxLength(90)
    name: string;

    @IsString()
    @IsEmail()
    email: string;
}
