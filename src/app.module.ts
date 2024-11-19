import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { TeacherModule } from './teacher/teacher.module';
import { ExamModule } from './exam/exam.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, UserModule, TeacherModule, ExamModule, RoomModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
