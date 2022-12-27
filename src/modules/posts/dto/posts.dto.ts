import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PostStatus } from '../posts-status.enum';

export class PostDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    excerpt: string;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsNumber()
    authorId: number;

    @IsNotEmpty()
    @IsArray()
    categories: string[];

    @IsNotEmpty()
    @IsArray()
    tags: string[];

    @IsOptional()
    @IsEnum(PostStatus)
    status?: PostStatus;
}

export class UpdatePostDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    excerpt?: string;

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsNumber()
    authorId?: number;

    @IsOptional()
    @IsArray()
    categories?: string[];

    @IsOptional()
    @IsArray()
    tags?: string[];

    @IsOptional()
    @IsEnum(PostStatus)
    status?: PostStatus;
}
