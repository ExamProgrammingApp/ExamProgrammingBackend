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
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class ExamService {
    constructor(
        @InjectRepository(Exam)
        private examRepository: Repository<Exam>,

        @InjectRepository(Teacher)
        private teacherRepository: Repository<Teacher>,

        @InjectRepository(Student)
        private studentRepository: Repository<Student>,

        private notificationService: NotificationService,
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
            relations: ['user'],
        });

        if (!teacher) {
            throw new Error(`Teacher with ID ${createExamDto.teacherId} not found`);
        }

        if (!student) {
            throw new Error(`Student not found`);
        }

        const exam = this.examRepository.create({ ...createExamDto, status: Status.PENDING, teacher, student });
        console.log('Exam data before saving:', exam);

        const teacherUser = teacher.user;

        if (teacherUser) {
            // Trimitem notificarea către profesor
            await this.notificationService.createNotification(teacherUser, 'New exam to review', Status.PENDING);
        } else {
            console.error('Teacher does not have a valid user associated with them');
        }

        return await this.examRepository.save(exam);
    }


    async findAll(): Promise<Exam[]> {
        return this.examRepository.find({
            where: { status: Status.APPROVED },
            relations: ['teacher', 'rooms'],  // Load the teacher relation
            select: {
                teacher: {
                    name: true,  // Select only the teacher's name
                },
            },
        });
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
                    status: Status.APPROVED,
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
                    status: Status.APPROVED,
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


    async rejectExam(examId: string, token: any): Promise<any> {
        // Căutăm examenul în baza de date pe baza examId
        const exam = await this.examRepository.findOne({
            where: { examId },
            relations: ['teacher', 'student', 'student.user'], // Aici presupunem că examenul are o relație cu un profesor
        });

        if (!exam) {
            throw new NotFoundException(`Exam with ID ${examId} not found`);
        }

        // Verificăm dacă profesorul este același cu cel care a trimis cererea
        const teacher = await this.teacherRepository.findOne({
            where: { user: { userId: token.id } },
        });

        if (exam.teacher.teacherId !== teacher?.teacherId) {
            throw new UnauthorizedException('You are not authorized to update this exam');
        }

        exam.status = Status.REJECTED;

        if (exam.student) {
            if (exam.student.user) {
                await this.notificationService.createNotification(
                    exam.student.user, 
                    'Your exam request was rejected. Modify the request',
                    Status.REJECTED,
                );
            } else {
                console.log('Student found, but no user associated with the student');
                throw new Error('Student exists, but no user found for the exam');
            }
        } else {
            console.log('No student found for this exam');
            throw new Error('No student found for this exam');
        }

        await this.examRepository.save(exam);
        return { message: 'Exam rejected successfully' };
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
            relations: ['student', 'teacher'],
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

        const teacher = await this.teacherRepository.findOne({
            where: { user: exam.teacher.user},
            relations: ['user'],
        });
        if (!teacher) {
            throw new UnauthorizedException('Profesorul nu a fst gasit');
        }
        const teacherUser = teacher.user;

        if (teacherUser) {
            // Trimitem notificarea către profesor
            await this.notificationService.createNotification(teacherUser, 'New exam to review', Status.PENDING);
        } else {
            console.error('Teacher does not have a valid user associated with them');
        }

        return await this.examRepository.save(exam);
    }


    async findExamByTeacherId(userId: string): Promise<Exam[]> {
        let exams: Exam[];

        const teacher = await this.teacherRepository.findOne({
            where: { user: { userId } },
            relations: ['user'],
        });

        if (!teacher) {
            throw new NotFoundException('Profesorul nu a fost găsit');
        }

        exams = await this.examRepository.find({
            where: {
                teacher: { teacherId: teacher.teacherId },
                status: Status.PENDING, // Căutăm examenele asociate teacherId
            },
            relations: ['teacher'],
        });

        if (exams.length === 0) {
            throw new NotFoundException('Nu au fost găsite examene aprobate pentru acest profesor');
        }

        return exams;
    }

    async findExamByTeacherIdForStudent(teacherId: string): Promise<Exam[]> {
        const exams = await this.examRepository.find({
            where: {
                teacher: { teacherId },
                status: Status.APPROVED, // Sau statusul dorit
            },
            relations: ['teacher', 'student', 'rooms'],
        });

        if (exams.length === 0) {
            throw new NotFoundException('Nu au fost găsite examene pentru acest profesor');
        }

        return exams;
    }
}


