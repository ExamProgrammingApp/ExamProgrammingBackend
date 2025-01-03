import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { Teacher } from './entity/teacher.entity';
import { Exam } from '../exam/entity/exam.entity';
import { Room } from '../room/entity/room.entity';
import { Student } from '../student/entity/student.entity';  
import { StudentModule } from '../student/student.module'; 
import { Notification} from '../notification/entity/notification.entity'; 
import { NotificationService } from '../notification/notification.service';

@Module({
    imports: [TypeOrmModule.forFeature([Teacher, Exam, Room, Student, Notification])],
    providers: [TeacherService, NotificationService],
    controllers: [TeacherController],
})
export class TeacherModule { }