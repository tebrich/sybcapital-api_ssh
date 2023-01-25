import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ContactDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @Length(1, 200)
    message: string;
}
