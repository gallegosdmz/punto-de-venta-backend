import { Type } from "class-transformer";
import { IsInt } from "class-validator";
import { CreateExpenseDto } from "src/expenses/dto/create-expense.dto";

export class RestockProductDto {
    @IsInt()
    @Type(() => Number)
    restock: number;

    @Type(() => CreateExpenseDto)
    expense: CreateExpenseDto;
}