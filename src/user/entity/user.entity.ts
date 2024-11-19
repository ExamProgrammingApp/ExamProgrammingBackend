import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Role } from '../../enums/user.enum';
import { Teacher } from '../../teacher/entity/teacher.entity';

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
}