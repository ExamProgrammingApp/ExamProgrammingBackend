import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { TeacherModule } from './teacher/teacher.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, UserModule, TeacherModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
