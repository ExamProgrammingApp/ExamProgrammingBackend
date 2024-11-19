import { Controller, Get, Post, Put,Delete , Body, Param, Patch } from '@nestjs/common';
import { StudentService } from './student.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entity/student.entity';

@Controller('students')
export class StudentController {
    constructor(private readonly studentService: StudentService) {}

    @Get()
    @ApiOperation({ summary: 'Get all students' })
    @ApiResponse({ status: 200, description: 'List of all students', type: [Student] })
    async findAll(): Promise<Student[]> {
        return await this.studentService.findAll();
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get student by id' })
    @ApiResponse({ status: 200 })
    @ApiParam({ name: 'id', description: 'Id of the student' })
    async findOne(@Param('id') id: string): Promise<Student> {
        return await this.studentService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new student' })
    @ApiBody({ type: CreateStudentDto })
    @ApiResponse({ status: 201, description: 'Student successfully created', type: Student })
    async create(@Body() createStudentDto: CreateStudentDto): Promise<Student> {
        return await this.studentService.create(createStudentDto);
    }
    
    @Put(':id')
    @ApiOperation({ summary: 'Update a student' })
    @ApiParam({ name: 'id', description: 'Id of the student' })
    @ApiBody({ type: UpdateStudentDto })
    @ApiResponse({ status: 200, description: 'Student successfully updated', type: Student })
    async update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto): Promise<Student> {
        return await this.studentService.update(id, updateStudentDto);
    }

    @ApiOperation({ summary: 'Delete a student' })
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        await this.studentService.remove(id);
    }

}
