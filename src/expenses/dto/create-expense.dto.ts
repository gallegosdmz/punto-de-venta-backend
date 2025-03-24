import { IsNumber, IsString, MaxLength } from "class-validator";

export class CreateExpenseDto {
    @IsString()
    @MaxLength(149)
    concept: string;

    @IsNumber()
    total: number;
}
