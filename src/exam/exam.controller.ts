import { Controller, Get, Post, Body } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateExamDto } from './dto/create-exam.dto';
import { Exam } from './entity/exam.entity';

@Controller('exams')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Get()
  @ApiOperation({ summary: 'Get all exams' })
  @ApiResponse({ status: 200, description: 'List of all exams', type: [Exam] })
  async findAll(): Promise<Exam[]> {
    return await this.examService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new exam' })
  @ApiBody({ type: CreateExamDto })
  @ApiResponse({
    status: 201,
    description: 'Exam successfully created',
    type: Exam,
  })
  async create(@Body() createExamDto: CreateExamDto): Promise<Exam> {
    return await this.examService.create(createExamDto);
  }
}
