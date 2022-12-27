import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FilesDto {
    @IsNotEmpty()
    @IsString()
    url: string;

    @IsOptional()
    @IsBoolean()
    feature: boolean;
}
