import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Exam } from '../../exam/entity/exam.entity';

@Entity('students')
export class Student {
    @PrimaryGeneratedColumn("uuid")
    studentId!: string;

    @Column({ nullable: false })
    name!: string;

    @Column({ nullable: true })
    group!: string;

    @Column({ type: 'int', nullable: true })
    year!: number;

    @Column({ unique: true, nullable: true })
    CNP!: string;

    @OneToOne(() => User, (user) => user.student, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'userId' })
    user!: User;

    @OneToMany(() => Exam, (exam) => exam.student)
    exams!: Exam[];
}
