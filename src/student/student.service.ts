import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entity/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student)
        private readonly studentRepository: Repository<Student>,
    ) {}

    async findAll(): Promise<Student[]> {
        return await this.studentRepository.find();
    }
    async findOne(id: string): Promise<Student> {
        const existStudent = await this.studentRepository.findOne({ where: { studentId: id }, select: ['studentId', 'name', 'group', 'year', 'CNP', 'userId'], });
        if (!existStudent) {
            throw new NotFoundException('Category not found');
        }

        return existStudent
    }

    async create(student: CreateStudentDto): Promise<Student> {
        return await this.studentRepository.save(student);
    }

    async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
        const student = await this.findOne(id);
        Object.assign(student, updateStudentDto);
        return await this.studentRepository.save(student);
    }

    async remove(id: string): Promise<void> {
        const result = await this.studentRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Student not found');
        }
    }
    
}
