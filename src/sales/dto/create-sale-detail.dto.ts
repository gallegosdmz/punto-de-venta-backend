import { Type } from "class-transformer";
import { IsInt, IsNumber } from "class-validator";

export class CreateSaleDetailDto {
    @IsInt()
    @Type(() => Number)
    product: number;

    @IsInt()
    @Type(() => Number)
    quantity: number;

    @IsNumber()
    unitPrice: number;
}