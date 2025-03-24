import { Type } from "class-transformer";
import { IsInt } from "class-validator";

export class RestockProductDto {
    @IsInt()
    @Type(() => Number)
    restock: number;
}