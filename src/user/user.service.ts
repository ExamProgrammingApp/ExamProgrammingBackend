import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { Teacher } from '../teacher/entity/teacher.entity';
import { Role } from '../enums/user.enum';
import { Student } from '../student/entity/student.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectRepository(Teacher)
        private readonly teacherRepository: Repository<Teacher>,

        @InjectRepository(Student)
        private readonly studentRepository: Repository<Student>,
    ) { }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(id: string): Promise<User> {
        const existUser = await this.userRepository.findOne({
            where: { userId: id },
            select: ['userId', 'name', 'email', 'role'],
        });
        if (!existUser) {
            throw new NotFoundException('User not found');
        }

        return existUser
    }

    async create(user: CreateUserDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser = this.userRepository.create({ ...user, password: hashedPassword });

        const savedUser = await this.userRepository.save(newUser);

        if (user.role === Role.TEACHER) {
            const teacherData = {
                name: user.name,
                user: savedUser
            };
            const teacher = this.teacherRepository.create(teacherData);
            await this.teacherRepository.save(teacher);
        }

        if (user.role === Role.STUDENT) {
            const studentData = {
                name: user.name,
                user: savedUser
            };
            const student = this.studentRepository.create(studentData);
            await this.studentRepository.save(student);
        }
        if (user.role === Role.HEADSTUDENT) {
            const headStudentData = {
                name: user.name,
                user: savedUser
            };
            const student = this.studentRepository.create(headStudentData);
            await this.studentRepository.save(student);
        }

        return savedUser
    }

    async update(id: string, updateUserDto: CreateUserDto): Promise<User> {
        const user = await this.findOne(id);
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        Object.assign(user, updateUserDto);
        return this.userRepository.save(user);
    }

    async remove(id: string): Promise<void> {
        const result = await this.userRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('User not found');
        }
    }
}