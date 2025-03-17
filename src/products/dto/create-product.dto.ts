import { Type } from "class-transformer";
import { IsDecimal, IsInt, IsString, MaxLength } from "class-validator";

export class CreateProductDto {
    @IsString()
    @MaxLength(90)
    name: string;

    @IsString()
    description: string;

    @IsDecimal()
    price: number;

    @IsString()
    barCode: string;

    @IsInt()
    @Type(() => Number)
    stock: number;

    @IsInt()
    @Type(() => Number)
    category: number;

    @IsInt()
    @Type(() => Number)
    supplier: number;
}
