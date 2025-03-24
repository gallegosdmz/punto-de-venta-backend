import { Type } from "class-transformer";
import { IsInt } from "class-validator";

export class DecrementStockDto {
    @IsInt()
    @Type(() => Number)
    decrementStock: number;
}