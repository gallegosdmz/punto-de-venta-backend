import { Type } from "class-transformer";
import { IsInt, IsNumber, IsString, MaxLength } from "class-validator";
import { CreateExpenseDto } from "src/expenses/dto/create-expense.dto";

export class CreateProductDto {
    @IsString()
    @MaxLength(90)
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    price: number;

    @IsNumber()
    purchasePrice: number;

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

    @Type(() => CreateExpenseDto)
    expense: CreateExpenseDto;
}
