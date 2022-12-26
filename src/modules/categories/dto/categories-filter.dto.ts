import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CategoriesFilterDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsNotEmpty()
    @IsNumber()
    limit: number;

    @IsNotEmpty()
    @IsNumber()
    page: number;

    @IsOptional()
    @IsBoolean()
    includeDeleted?: boolean;

    @IsOptional()
    @IsBoolean()
    includePosts?: boolean;
}
