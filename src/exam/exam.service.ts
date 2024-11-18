import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExamDto } from './dto/create-exam.dto';
import { Exam } from './entity/exam.entity';
import { Teacher } from '../teacher/entity/teacher.entity';
import { Status } from '../enums/exam.enum';

@Injectable()
export class ExamService {
    constructor(
        @InjectRepository(Exam)
        private examRepository: Repository<Exam>,

        @InjectRepository(Teacher)
        private teacherRepository: Repository<Teacher>,
    ) { }


    async create(createExamDto: CreateExamDto): Promise<Exam> {
        const teacher = await this.teacherRepository.findOne({
            where: { teacherId: createExamDto.teacherId },
        });

        if (!teacher) {
            throw new Error(`Teacher with ID ${createExamDto.teacherId} not found`);
        }

        const exam = this.examRepository.create({ ...createExamDto, status: Status.PENDING, teacher });

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

    async findOneByStatus(examId: string): Promise<Exam> {
        const exam = await this.examRepository.findOne({
            where: { status: Status.REJECTED },
            relations: ['teacher'],
        });

        if (!exam) {
            throw new NotFoundException(`Exam with ID ${examId} not found`);
        }

        return exam;
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
}


