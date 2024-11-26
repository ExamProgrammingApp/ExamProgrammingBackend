import { IsString, IsEnum, IsDateString, IsNotEmpty, IsInt, Min, Matches } from 'class-validator';
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

    @ApiProperty({ example: '3', description: 'Number of students taking the exam' })
    @IsInt()
    @Min(1)
    numberOfStudents!: number;

    @ApiProperty({ example: '09:30', description: 'Start time of the exam (HH:mm)' })
    @IsString()
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'startTime must be in HH:mm format',
    })
    startTime!: string;

    @ApiProperty({ example: '', description: 'Teacher' })
    @IsString()
    @IsNotEmpty()
    teacherId!: string;
}
