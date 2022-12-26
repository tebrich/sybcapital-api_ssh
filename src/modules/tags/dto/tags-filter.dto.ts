import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class TagsFilterDto {
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
    inlcudeDeleted?: boolean;

    @IsOptional()
    @IsBoolean()
    includePosts?: boolean;
}
