import { Type } from "class-transformer";
import { IsDate } from "class-validator";

export class GenerateDailyReportDto {
    @IsDate()
    @Type(() => Date)
    dateSale: Date;
}