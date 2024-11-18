import { Controller, Get, Post, Body, Query, NotFoundException, Param, Delete } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateExamDto } from './dto/create-exam.dto';
import { Exam } from './entity/exam.entity';

@Controller('exams')
export class ExamController {
  constructor(private readonly examService: ExamService) { }

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


  @Get(':id')
  @ApiOperation({ summary: 'Get exam by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Id of the exam' })
  async findOne(@Param('id') id: string): Promise<Exam> {
    return this.examService.findOne(id);
  }

  @Get('status/:id')
  @ApiOperation({ summary: 'Get exam by status' })
  @ApiParam({ name: 'id', type: 'string', description: 'Id of the exam' })
  async findOneByStatus(@Param('id') id: string): Promise<Exam> {
    return this.examService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete exam by Id' })
  @ApiParam({ name: 'id', type: 'string', description: 'Id of the exam' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.examService.delete(id);
  }


  @Get()
  @ApiOperation({ summary: 'Get exams by group or subject' })
  @ApiQuery({
    name: 'group',
    type: String,
    required: false,
    description: 'Group of the exam',
    example: 'GroupA',
  })
  @ApiQuery({
    name: 'subject',
    type: String,
    required: false,
    description: 'Subject of the exam',
    example: 'Math',
  })
  async findOneByGroupOrSubject(
    @Query('group') group?: string,
    @Query('subject') subject?: string,
  ): Promise<Exam[]> {

    if ((!group || group.trim() === '') && (!subject || subject.trim() === '')) {
      throw new NotFoundException(`Please provide either a valid group or subject`);
    }

    return this.examService.findOneByGroupOrSubject(group, subject);
  }
}
