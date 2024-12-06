import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { CreateExamDto } from './dto/create-exam.dto';
import { Exam } from './entity/exam.entity';
import { Teacher } from '../teacher/entity/teacher.entity';
import { User } from '../user/entity/user.entity';
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

    async findAllByStatusPending(@Token() token: any): Promise<Exam[]> {
        const exams = await this.examRepository.find({
            where: {
                status: Status.REJECTED,
                student: { user: { userId: token.id } },
            },
            relations: ['teacher'],
        });

        if (exams.length === 0) {
            throw new NotFoundException('No pending exams found for the logged-in student');
        }

        return exams;
    }
    async findExamsForUser(userId: string, role: string): Promise<Exam[]> {
        let exams: Exam[];
        if (role === 'teacher') {
            const teacher = await this.teacherRepository.findOne({
                where: { user: { userId } },
                relations: ['user'],
            });
            if (!teacher) {
                throw new NotFoundException('Teacher not found');
            }
            exams = await this.examRepository.find({
                where: {
                    teacher: { teacherId: teacher.teacherId },
                },
                relations: ['teacher'],
            });
        } else if (role === 'student' || role === 'headstudent') {
            const student = await this.studentRepository.findOne({
                where: { user: { userId } },
                relations: ['user'],
            });
            if (!student) {
                throw new NotFoundException('Student not found');
            }
            exams = await this.examRepository.find({
                where: {
                    group: student.group,
                },
                relations: ['student'],
            });
        } else {
            throw new BadRequestException('Invalid role');
        }
        if (exams.length === 0) {
            throw new NotFoundException('No exams found for the given date and user');
        }
        return exams;
    }

    async findExamsByDateForUser(userId: string, role: string, date: Date): Promise<Exam[]> {
        const formattedDate = date.toISOString().split('T')[0];
        let exams: Exam[];
        if (role === 'teacher') {
            const teacher = await this.teacherRepository.findOne({
                where: { user: { userId } },
                relations: ['user'],
            });
            if (!teacher) {
                throw new NotFoundException('Teacher not found');
            }
            exams = await this.examRepository.find({
                where: {
                    teacher: { teacherId: teacher.teacherId },
                    date: Raw((dateField) => `DATE(${dateField}) = '${formattedDate}'`),
                    status: Status.APPROVED
                },
                relations: ['teacher', 'rooms'],
            });
            console.log('Exam details with teacher relation:', exams);
        } else if (role === 'student' || role === 'headstudent') {
            const student = await this.studentRepository.findOne({
                where: { user: { userId } },
                relations: ['user'],
            });
            if (!student) {
                throw new NotFoundException('Student not found');
            }
            exams = await this.examRepository.find({
                where: {
                    date: Raw((dateField) => `DATE(${dateField}) = '${formattedDate}'`),
                    group: student.group,
                    status: Status.APPROVED
                },
                relations: ['student', 'teacher', 'rooms'],
            });
        } else {
            throw new BadRequestException('Invalid role');
        }
        if (exams.length === 0) {
            throw new NotFoundException('No exams found for the given date and user');
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

    async findExamByTeacherId(@Token() token: any): Promise<Exam[]> {
        console.log("Extracted teacherId from token:", token.id);
        const exams = await this.examRepository.find({
            where: { teacher: { teacherId: token.teacherId } },
        });
        return exams;

    }
}


