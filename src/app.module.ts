import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, UserModule, StudentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
