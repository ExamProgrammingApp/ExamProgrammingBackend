import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'joe.doe@gmail.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'Labus4444' })
    @IsString()
    password!: string;
}