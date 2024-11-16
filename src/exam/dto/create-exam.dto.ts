import { IsString, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../../enums/exam.enum';

export class CreateExamDto {
    @ApiProperty({ example: '2024-12-01', description: 'Date of the exam' })
    @IsDateString()
    date!: Date;

    @ApiProperty({ example: '2 hours', description: 'Duration of the exam' })
    @IsString()
    duration!: string;

    @ApiProperty({ example: 'Room 101', description: 'Room where the exam will take place' })
    @IsString()
    room!: string;

    @ApiProperty({ example: 'Dr. Smith', description: 'Teacher for the exam' })
    @IsString()
    teacher!: string;

    @ApiProperty({ example: 'Mathematics', description: 'Subject of the exam' })
    @IsString()
    subject!: string;

    @ApiProperty({ example: Status.PENDING, enum: Status, description: 'The status of the exam' })
    @IsEnum(Status)
    status!: Status;

    @ApiProperty({ example: 'Group A', description: 'Group taking the exam' })
    @IsString()
    group!: string;
}
