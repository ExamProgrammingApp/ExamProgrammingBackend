import { IsString, IsInt, Min, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
    @ApiProperty({ example: 'John Doe', description: 'The name of the student' })
    @IsString()
    name!: string;

    @ApiProperty({ example: '3142a', description: 'The group of the student' })
    @IsString()
    group!: string;

    @ApiProperty({ example: 4, description: 'The year of the student' })
    @IsInt()
    @Min(1)
    year!: number;

    @ApiProperty({ example: '1234567890123', description: 'The CNP of the student' })
    @IsString()
    CNP!: string;

    @ApiProperty({ example: 1, description: 'The ID of the associated user' })
    userId!: number;
}
