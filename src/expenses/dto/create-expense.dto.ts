import { IsNumber, IsString, MaxLength } from "class-validator";

export class CreateExpenseDto {
    @IsString()
    @MaxLength(149)
    concept: string;

    @IsString()
    @MaxLength(149)
    expCategory: string;

    @IsString()
    @MaxLength(149)
    method: string;

    @IsNumber()
    total: number;
}
