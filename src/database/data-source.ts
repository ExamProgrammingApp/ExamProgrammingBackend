import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Room } from '../room/entity/room.entity';
import { Teacher } from '../teacher/entity/teacher.entity';
import { Exam } from '../exam/entity/exam.entity';
import { User } from '../user/entity/user.entity';
import * as dotenv from 'dotenv';

dotenv.config();
const configService = new ConfigService();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: configService.get<string>('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT'),
    username: configService.get<string>('DATABASE_USER'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    database: configService.get<string>('DATABASE_NAME'),
    synchronize: true,
    entities: [Room, Teacher, Exam, User],
});