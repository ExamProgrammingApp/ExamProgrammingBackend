import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './entity/teacher.entity';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Status } from '../enums/exam.enum';
import { Exam } from '../exam/entity/exam.entity';
import { Room } from '../room/entity/room.entity';
import { RoomStatus } from '../enums/room.enum';

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

    async update(id: string, updateTeacherDto: UpdateTeacherDto): Promise<Teacher> {
        const teacher = await this.findOne(id);

        Object.assign(teacher, updateTeacherDto);
        return this.teacherRepository.save(teacher);
    }

    async delete(id: string): Promise<void> {
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

    async updateRoomForExam(examId: string, roomIds: string[]): Promise<Exam> {
        const exam = await this.examRepository.findOne({
            where: { examId },
            relations: ['teacher', 'rooms'],
        });

        if (!exam) {
            throw new NotFoundException(`Exam with ID ${examId} not found`);
        }


        const rooms = await this.roomRepository.findByIds(roomIds);

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

        for (const room of rooms) {
            room.status = RoomStatus.BOOKED;
            await this.roomRepository.save(room);
        }


        return this.examRepository.save(exam);
    }
}