import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './entity/teacher.entity';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Status } from '../enums/exam.enum';
import { Exam } from '../exam/entity/exam.entity';
import { Room } from '../room/entity/room.entity';
import { RoomStatus } from '../enums/room.enum';
import { Token } from '../auth/token.decorator';
import { Role } from '../enums/user.enum';

@Injectable()
export class TeacherService {
    constructor(
        @InjectRepository(Teacher)
        private readonly teacherRepository: Repository<Teacher>,

        @InjectRepository(Exam)
        private examRepository: Repository<Exam>,

        @InjectRepository(Room)
        private roomRepository: Repository<Room>,
    ) { }

    async findAll(): Promise<Teacher[]> {
        return this.teacherRepository.find();
    }

    async findOne(id: string): Promise<Teacher> {
        const teacher = await this.teacherRepository.findOne({ where: { teacherId: id }, relations: ['user'] });
        if (!teacher) {
            throw new NotFoundException(`Teacher not found`);
        }
        return teacher;
    }

    async update(id: string, updateTeacherDto: UpdateTeacherDto, token: any): Promise<Teacher> {

        const loggedInTeacher = await this.teacherRepository.findOne({
            where: { user: { userId: token.id } },
            relations: ['user'],
        });

        if (!loggedInTeacher) {
            throw new UnauthorizedException('Logged-in user is not associated with a teacher');
        }

        if (loggedInTeacher.teacherId !== id) {
            throw new ForbiddenException(`You are not authorized to update this teacher's information`);
        }

        const teacher = await this.findOne(id);

        Object.assign(teacher, updateTeacherDto);
        return this.teacherRepository.save(teacher);
    }

    async delete(id: string, token: any): Promise<void> {
        if (token.role !== Role.ADMIN) {
            throw new UnauthorizedException('Only admins can delete');
        }

        const result = await this.teacherRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Teacher with ID ${id} not found`);
        }
    }

    async findOneBySubject(subject: string): Promise<Teacher> {
        const teacher = await this.teacherRepository.findOne({ where: { subject }, relations: ['user'] });
        if (!teacher) {
            throw new NotFoundException(`Teacher with subject ${subject} not found`);
        }
        return teacher;
    }

    async updateRoomForExam(examId: string, roomIds: string[], @Token() token: any, teacherAssistentId: string): Promise<Exam> {
        if (token.role !== Role.TEACHER) {
            throw new UnauthorizedException('Only teachers can update exam rooms');
        }
        const exam = await this.examRepository.findOne({
            where: { examId },
            relations: ['teacher', 'rooms'],
        });

        if (!exam) {
            throw new NotFoundException(`Exam with ID ${examId} not found`);
        }


        const rooms = await this.roomRepository.findByIds(roomIds);

        const teacherAssistant: any = await this.teacherRepository.findOne({
            where: { teacherId: teacherAssistentId },
        });

        const occupiedRooms = rooms.filter(room => room.status === RoomStatus.BOOKED);

        if (occupiedRooms.length > 0) {
            const occupiedRoomNames = occupiedRooms.map(room => room.name).join(', ');
            throw new ConflictException(`Rooms ${occupiedRoomNames} are already occupied and cannot be selected.`);
        }

        if (rooms.length === 0) {
            throw new NotFoundException(`Rooms with IDs ${roomIds.join(', ')} not found`);
        }


        exam.rooms = rooms;
        exam.status = Status.APPROVED
        exam.teacherAssistent = teacherAssistant.teacherId;

        for (const room of rooms) {
            room.status = RoomStatus.BOOKED;
            await this.roomRepository.save(room);
        }


        return this.examRepository.save(exam);
    }
}