import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Student } from '../student/entity/student.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'postgres',
            database: 'postgres',
            synchronize: true,
            entities: [User, Student],
            // migrations: ["src/migrations/*.ts"],

        }),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule { }