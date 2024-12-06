import { Controller, Get, Post, Body, Query, NotFoundException, Param, Delete, Patch, BadRequestException } from '@nestjs/common';
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

  @Get()
  @ApiOperation({ summary: 'Get approved exams for the authenticated user' })
  async findExamsForUser(
    @Token() token: any
  ): Promise<Exam[]> {
    console.log('Token primit în controller:', token);

    if (!token || !token.id || !token.role) {
      throw new BadRequestException('Token-ul nu conține un userId sau un role valid.');
    }
    return this.examService.findExamsForUser(token.id, token.role);
  }


  @Get('date/:date')
  @ApiOperation({ summary: 'Get approved exams by date for the authenticated user' })
  @ApiParam({
    name: 'date',
    type: 'string',
    description: 'The exam date in format YYYY-MM-DD',
    example: '2024-11-28',
  })
  async findExamsByDateForUser(
    @Param('date') date: string,
    @Token() token: any
  ): Promise<Exam[]> {
    console.log('Token primit în controller:', token);
    if (!token || !token.id || !token.role) {
      throw new BadRequestException('Token-ul nu conține un userId sau un role valid.');
    }
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException('Data furnizată nu este validă.');
    }
    return this.examService.findExamsByDateForUser(token.id, token.role, parsedDate);
  }


  @Get(':id')
  @ApiOperation({ summary: 'Get exam by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Id of the exam' })
  async findOne(@Param('id') id: string): Promise<Exam> {
    return this.examService.findOne(id);
  }

  @Get('status/rejected')
  @ApiOperation({ summary: 'Get exam by status rejected' })
  async findAllPendingExams(@Token() token: any): Promise<Exam[]> {
    return await this.examService.findAllByStatusPending(token);
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

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Reject an exam by ID (for teachers)' })
  @ApiParam({ name: 'id', type: 'string', description: 'Id of the exam to reject' })
  async rejectExam(
    @Param('id') id: string,   // Preluăm examId din URL
    @Token() token: any        // Preluăm token-ul din request
  ): Promise<any> {
    return await this.examService.rejectExam(id, token);
  }


  /*@Get()
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
  }*/

  @Get('teacher/teacherId')
  @ApiOperation({ summary: '' })
  async findExamByTeacher(@Token() token: any): Promise<Exam[]> {
    if (!token || !token.id) {
      throw new BadRequestException('Token-ul nu conține un userId sau un role valid.');
    }
    return this.examService.findExamByTeacherId(token.id);
  }
}
