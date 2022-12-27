import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PostsFilterDto {
    @IsNotEmpty()
    @IsNumber()
    limit: number;

    @IsNotEmpty()
    @IsNumber()
    page: number;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsNumber()
    authorId?: number;

    @IsOptional()
    @IsArray()
    tags?: number[];

    @IsOptional()
    @IsArray()
    categories?: number[];
}
