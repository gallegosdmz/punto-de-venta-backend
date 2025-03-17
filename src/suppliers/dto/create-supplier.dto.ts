import { IsEmail, IsPhoneNumber, IsString, MaxLength } from "class-validator";

export class CreateSupplierDto {
    @IsString()
    @MaxLength(90)
    name: string;

    @IsString()
    @MaxLength(90)
    contact: string;

    @IsString()
    @MaxLength(20)
    @IsPhoneNumber("MX")
    phone: string;

    @IsString()
    @IsEmail()
    email: string;
}
