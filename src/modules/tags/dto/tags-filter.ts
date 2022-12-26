import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class TagsFilter {
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
