import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CategoriesDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsBoolean()
    featured?: boolean;

    @IsOptional()
    @IsNumber()
    parentId?: number;
}

export class UpdateCategoriesDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsBoolean()
    featured?: boolean;

    @IsOptional()
    @IsNumber()
    parentId?: number;
}
