import { IsString, IsInt, Min, IsOptional } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateStudentDto } from './create-student.dto';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
    @ApiProperty({ example: 'John Doe', description: 'The name of the student', required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ example: '3142a', description: 'The group of the student', required: false })
    @IsOptional()
    @IsString()
    group?: string;

    @ApiProperty({ example: 4, description: 'The year of the student', required: false })
    @IsOptional()
    @IsInt()
    @Min(1)
    year?: number;

    @ApiProperty({ example: '1234567890123', description: 'The CNP of the student', required: false })
    @IsOptional()
    @IsString()
    CNP?: string;
}