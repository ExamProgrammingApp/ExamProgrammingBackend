import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExamDto } from './dto/create-exam.dto';
import { Exam } from './entity/exam.entity';
import { Teacher } from '../teacher/entity/teacher.entity';
import { Status } from '../enums/exam.enum';
import { Token } from '../auth/token.decorator';
import { Role } from '../enums/user.enum';
import { Student } from '../student/entity/student.entity';
import { UpdateExamDto } from './dto/update-exam.dto';

@Injectable()
export class ExamService {
    constructor(
        @InjectRepository(Exam)
        private examRepository: Repository<Exam>,

        @InjectRepository(Teacher)
        private teacherRepository: Repository<Teacher>,

        @InjectRepository(Student)
        private studentRepository: Repository<Student>,
    ) { }


    async create(createExamDto: CreateExamDto, @Token() token: any): Promise<Exam> {
        console.log('Token:', token);
        if (token.role !== Role.HEADSTUDENT) {
            console.error('Unauthorized: Only students can create exams');
            throw new UnauthorizedException('Only students can create exams');
        }


        const student = await this.studentRepository.findOne({
            where: { user: { userId: token.id } },
        });

        const teacher = await this.teacherRepository.findOne({
            where: { teacherId: createExamDto.teacherId },
        });

        if (!teacher) {
            throw new Error(`Teacher with ID ${createExamDto.teacherId} not found`);
        }

        if (!student) {
            throw new Error(`Student not found`);
        }

        const exam = this.examRepository.create({ ...createExamDto, status: Status.PENDING, teacher, student });
        console.log('Exam data before saving:', exam);

        return await this.examRepository.save(exam);
    }



    async findOne(examId: string): Promise<Exam> {
        const exam = await this.examRepository.findOne({
            where: { examId },
            relations: ['teacher'],
        });

        if (!exam) {
            throw new NotFoundException(`Exam with ID ${examId} not found`);
        }

        return exam;
    }

    async findAllByStatusPending(): Promise<Exam[]> {
        const exams = await this.examRepository.find({
            where: { status: Status.REJECTED },
            relations: ['teacher'],
        });

        if (exams.length === 0) {
            throw new NotFoundException('No exams with REJECTED status found');
        }

        return exams;
    }
    async findOneByGroupOrSubject(group?: string, subject?: string): Promise<Exam[]> {

        const query = this.examRepository.createQueryBuilder('exam')
            .leftJoinAndSelect('exam.teacher', 'teacher');

        if (group && group.trim() !== '') {
            query.andWhere('exam.group = :group', { group });
        }

        if (subject && subject.trim() !== '') {
            query.andWhere('exam.subject = :subject', { subject });
        }

        const exams = await query.getMany();

        if (exams.length === 0) {
            throw new NotFoundException(`No exams found for the given criteria`);
        }

        return exams;
    }

    async delete(id: string): Promise<void> {
        const result = await this.examRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Exam with ID ${id} not found`);
        }
    }

    async updateExam(
        examId: string,
        updateExamDto: UpdateExamDto,
        @Token() token: any
    ): Promise<Exam> {
        const exam = await this.examRepository.findOne({
            where: { examId },
            relations: ['student'],
        });

        if (!exam) {
            throw new NotFoundException(`Exam with ID ${examId} not found`);
        }

        const student = await this.studentRepository.findOne({
            where: { user: { userId: token.id } },
        });

        if (exam.student.studentId !== student?.studentId) {
            throw new UnauthorizedException(
                'You are not authorized to update this exam'
            );
        }

        if (updateExamDto.date) {
            exam.date = updateExamDto.date;
        }
        if (updateExamDto.startTime) {
            exam.startTime = updateExamDto.startTime;
        }

        exam.status = Status.PENDING

        return await this.examRepository.save(exam);
    }
}


