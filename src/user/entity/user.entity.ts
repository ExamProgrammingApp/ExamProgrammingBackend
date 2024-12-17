import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { Notification } from '../../notification/entity/notification.entity';
import { Role } from '../../enums/user.enum';
import { Teacher } from '../../teacher/entity/teacher.entity';
import { Student } from '../../student/entity/student.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    userId!: string;

    @Column({ nullable: false })
    name!: string;

    @Column({ unique: true, nullable: false })
    email!: string;

    @Column({ nullable: false })
    password!: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.STUDENT,
    })
    role!: string;

    @OneToOne(() => Teacher, (teacher) => teacher.user)
    teacher!: Teacher;

    @OneToOne(() => Student, (student) => student.user)
    student!: Student;

    @OneToMany(() => Notification, (notification) => notification.user)
    notifications!: Notification[];
}