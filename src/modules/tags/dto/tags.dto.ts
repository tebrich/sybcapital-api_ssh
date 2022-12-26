import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTagDto {
    @IsNotEmpty()
    @IsString()
    name: string;
}

export class UpdateTagDto {
    @IsOptional()
    @IsString()
    name?: string;
}
