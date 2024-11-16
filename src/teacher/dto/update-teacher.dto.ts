import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Category } from '../../enums/teacher.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTeacherDto {
    @IsString()
    @IsOptional()
    @ApiProperty({ example: 'John Doe', description: 'The name of the teacher' })
    name!: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: 'IP' })
    subject!: string;

    @IsEnum(Category)
    @ApiProperty({ example: Category.FIESC, enum: Category })
    @IsOptional()
    category!: Category;
}