import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExamDto } from './dto/create-exam.dto';
import { Exam } from './entity/exam.entity';

@Injectable()
export class ExamService {
    constructor(
        @InjectRepository(Exam)
        private examRepository: Repository<Exam>,
    ) {}

    async findAll(): Promise<Exam[]> {
        return this.examRepository.find();
    }

    async create(exam: CreateExamDto): Promise<Exam> {
        return this.examRepository.save(exam);
    }
}
