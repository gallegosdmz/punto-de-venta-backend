import { Type } from "class-transformer";
import { IsArray, IsDate, IsInt, IsNumber, ValidateNested } from "class-validator";
import { CreateSaleDetailDto } from "./create-sale-detail.dto";

export class CreateSaleDto {
    @IsDate()
    @Type(() => Date)
    dateSale: Date;

    @IsNumber()
    total: number;

    @IsArray()
    @ValidateNested({ each: true }) // Valida cada elemento del arreglo con la entidad indicada (SaleDetailDTO)
    @Type(() => CreateSaleDetailDto)
    details: CreateSaleDetailDto[];
}
