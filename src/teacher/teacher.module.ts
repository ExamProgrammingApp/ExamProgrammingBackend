import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { Teacher } from './entity/teacher.entity';
import { Exam } from '../exam/entity/exam.entity';
import { Room } from '../room/entity/room.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Teacher, Exam, Room])],
    providers: [TeacherService],
    controllers: [TeacherController],
})
export class TeacherModule { }