import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { Exam } from './entity/exam.entity';
import { Teacher } from '../teacher/entity/teacher.entity';
import { Student } from '../student/entity/student.entity';
import { NotificationModule } from '../notification/notification.module';
import { Notification } from '../notification/entity/notification.entity';
import { NotificationService } from '../notification/notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([Exam, Teacher, Student, Notification])],
  controllers: [ExamController],
  providers: [ExamService, NotificationService],
})
export class ExamModule { }
