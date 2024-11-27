import { Controller, Get, Post, Body, Query, NotFoundException, Param, Delete, Patch } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateExamDto } from './dto/create-exam.dto';
import { Exam } from './entity/exam.entity';
import { Token } from '../auth/token.decorator';
import { UpdateExamDto } from './dto/update-exam.dto';

@Controller('exams')
@ApiBearerAuth()
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
  async create(@Body() createExamDto: CreateExamDto, @Token() token: any): Promise<Exam> {
    return await this.examService.create(createExamDto, token);
  }


  @Get(':id')
  @ApiOperation({ summary: 'Get exam by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Id of the exam' })
  async findOne(@Param('id') id: string): Promise<Exam> {
    return this.examService.findOne(id);
  }

  @Get('status/rejected')
  @ApiOperation({ summary: 'Get exam by status rejected' })
  async findOneByStatus(): Promise<Exam[]> {
    return this.examService.findAllByStatusPending();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete exam by Id' })
  @ApiParam({ name: 'id', type: 'string', description: 'Id of the exam' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.examService.delete(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update exam by Id' })
  @ApiParam({ name: 'id', type: 'string', description: 'Id of the exam' })
  async updateExam(
    @Param('id') id: string,
    @Body() updateExamDto: UpdateExamDto,
    @Token() token: any
  ): Promise<Exam> {
    return await this.examService.updateExam(id, updateExamDto, token);
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
