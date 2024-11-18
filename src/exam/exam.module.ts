import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { Exam } from './entity/exam.entity';
import { Teacher } from '../teacher/entity/teacher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exam, Teacher])],
  controllers: [ExamController],
  providers: [ExamService],
  exports: [ExamService],
})
export class ExamModule { }
