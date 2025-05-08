import { Type } from "class-transformer";
import { IsArray, IsDate, IsInt, IsNumber, IsString, MaxLength, ValidateNested } from "class-validator";
import { CreateSaleDetailDto } from "./create-sale-detail.dto";

export class CreateSaleDto {
    @IsDate()
    @Type(() => Date)
    dateSale: Date;

    @IsNumber()
    total: number;

    @IsString()
    @MaxLength(150)
    client: string;

    @IsString()
    @MaxLength(150)
    method: string;

    @IsArray()
    @ValidateNested({ each: true }) // Valida cada elemento del arreglo con la entidad indicada (SaleDetailDTO)
    @Type(() => CreateSaleDetailDto)
    details: CreateSaleDetailDto[];
}
