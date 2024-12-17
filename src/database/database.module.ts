import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../user/entity/user.entity';
import { Student } from '../student/entity/student.entity';
import { Teacher } from '../teacher/entity/teacher.entity';
import { Exam } from '../exam/entity/exam.entity';
import { Room } from '../room/entity/room.entity';
import { Notification } from '../notification/entity/notification.entity';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('DATABASE_HOST'),
                port: configService.get<number>('DATABASE_PORT'),
                username: configService.get<string>('DATABASE_USER'),
                password: configService.get<string>('DATABASE_PASSWORD'),
                database: configService.get<string>('DATABASE_NAME'),
                synchronize: true,
                entities: [User, Student, Teacher, Exam, Room, Notification],
                // migrations: ["src/migrations/*.ts"],
            }),
        }),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule { }