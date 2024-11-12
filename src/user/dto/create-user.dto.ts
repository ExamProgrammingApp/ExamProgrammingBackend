import { IsString, IsEmail, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../enums/user.enum';

export class CreateUserDto {
    @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
    @IsString()
    name!: string;

    @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the user' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'password123', description: 'The password of the user' })
    @IsString()
    @MinLength(6)
    password!: string;

    @ApiProperty({ example: Role.STUDENT, enum: Role, description: 'The role of the user' })
    @IsEnum(Role, { message: 'Role must be either ADMIN, STUDENT or TEACHER' })
    role!: Role;
}