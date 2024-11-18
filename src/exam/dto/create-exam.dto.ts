import { IsString, IsEnum, IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../../enums/exam.enum';

export class CreateExamDto {
    @ApiProperty({ example: '2024-12-01', description: 'Date of the exam' })
    @IsDateString()
    date!: Date;

    @ApiProperty({ example: '2 hours', description: 'Duration of the exam' })
    @IsString()
    duration!: string;

    @ApiProperty({ example: 'Mathematics', description: 'Subject of the exam' })
    @IsString()
    subject!: string;

    @ApiProperty({ example: 'Group A', description: 'Group taking the exam' })
    @IsString()
    group!: string;

    @ApiProperty({ example: '', description: 'Teacher' })
    @IsString()
    @IsNotEmpty()
    teacherId!: string;
}
