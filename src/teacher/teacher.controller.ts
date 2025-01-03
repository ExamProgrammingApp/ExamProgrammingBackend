import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request, SetMetadata } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { Teacher } from './entity/teacher.entity';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Exam } from '../exam/entity/exam.entity';
import { UpdateRoomDto } from '../exam/dto/update-room.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Token } from '../auth/token.decorator';

@ApiTags('teachers')
@ApiBearerAuth()
@Controller('teachers')
export class TeacherController {
    constructor(private readonly teacherService: TeacherService) { }


    @Get()
    @ApiOperation({ summary: 'Get all teachers' })
    async findAll(): Promise<Teacher[]> {
        return this.teacherService.findAll();
    }


    @Get(':id')
    @ApiOperation({ summary: 'Get a teacher by Id' })
    @ApiParam({ name: 'id', type: 'string', description: 'Id of the teacher' })
    async findOne(@Param('id') id: string): Promise<Teacher> {
        return this.teacherService.findOne(id);
    }


    @Patch(':id')
    @ApiOperation({ summary: 'Update a teacher by Id' })
    @ApiParam({ name: 'id', type: 'string', description: 'Id of the teacher' })
    async update(
        @Param('id') id: string,
        @Body() updateTeacherDto: UpdateTeacherDto,
        @Token() token: any
    ): Promise<Teacher> {
        return this.teacherService.update(id, updateTeacherDto, token);
    }


    @Delete(':id')
    @ApiOperation({ summary: 'Delete a teacher by Id' })
    @ApiParam({ name: 'id', type: 'string', description: 'Id of the teacher' })
    async delete(@Param('id') id: string, @Token() token: any): Promise<void> {
        return this.teacherService.delete(id, token);
    }


    @Get('subject/:subject')
    @ApiOperation({ summary: 'Get a teacher by subject' })
    @ApiParam({ name: 'subject', type: 'string', description: 'Subject of the teacher' })
    async findTeacherBySubject(@Param('subject') subject: string) {
        return this.teacherService.findOneBySubject(subject);
    }


    @Patch(':examId/room')
    @ApiOperation({ summary: 'Set room for an exam' })
    @ApiParam({ name: 'examId', description: 'ID of the exam' })
    @ApiBody({
        type: UpdateRoomDto,
        description: 'The room and exam status to update',
    })
    async updateRoom(
        @Param('examId') examId: string,
        @Body() updateRoomDto: UpdateRoomDto,
        @Token() token: any
    ): Promise<Exam> {
        return this.teacherService.updateRoomForExam(examId, updateRoomDto.roomIds, token, updateRoomDto.teacherAssistent);
    }
}