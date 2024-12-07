import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entity/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../enums/user.enum';

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student)
        private readonly studentRepository: Repository<Student>,
    ) { }

    async findAll(): Promise<Student[]> {
        return await this.studentRepository.find();
    }
    async findOne(id: string): Promise<Student> {
        const existStudent = await this.studentRepository.findOne({ where: { user: { userId: id } } });
        if (!existStudent) {
            throw new NotFoundException('Student not found');
        }

        return existStudent
    }

    async create(student: CreateStudentDto): Promise<Student> {
        return await this.studentRepository.save(student);
    }

    async update(id: string, updateStudentDto: UpdateStudentDto, token: any): Promise<Student> {

        const loggedInStudent = await this.studentRepository.findOne({
            where: { user: { userId: token.id } },
            relations: ['user'],
        });

        if (!loggedInStudent) {
            throw new UnauthorizedException('Logged-in user is not associated with a student');
        }

        if (loggedInStudent.studentId !== id) {
            throw new ForbiddenException(`You are not authorized to update this student's information`);
        }

        const student = await this.findOne(id);
        Object.assign(student, updateStudentDto);
        return await this.studentRepository.save(student);
    }

    async remove(id: string, token: any): Promise<void> {
        if (token.role !== Role.ADMIN) {
            throw new UnauthorizedException('Only admins can delete');
        }

        const result = await this.studentRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Student not found');
        }
    }

}
