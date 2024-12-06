import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsOptional, IsString, Matches } from "class-validator";
import { Status } from '../../enums/exam.enum';

export class UpdateExamDto {
    @ApiProperty({ example: '2024-12-01', description: 'Date of the exam' })
    @IsOptional()
    @IsDateString()
    date!: Date;

    @ApiProperty({ example: '09:30', description: 'Start time of the exam (HH:mm)' })
    @IsOptional()
    @IsString()
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'startTime must be in HH:mm format',
    })
    startTime!: string;

    @ApiProperty({ example: 'rejected', description: 'Status of the exam (pending, confirmed, rejected)' })
    @IsOptional()
    @IsEnum(Status, { message: 'status must be one of the following: pending, confirmed, rejected' })
    status?: Status;
}