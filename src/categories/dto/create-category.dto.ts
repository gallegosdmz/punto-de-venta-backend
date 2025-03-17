import { IsString, MaxLength } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @MaxLength(90)
    name: string;
}
