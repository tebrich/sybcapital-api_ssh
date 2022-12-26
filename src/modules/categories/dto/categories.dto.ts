import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CategoriesDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;
}

export class UpdateCategoriesDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;
}
