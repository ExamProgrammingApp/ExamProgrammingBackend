import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('students')
export class Student {
    @PrimaryGeneratedColumn("uuid")
    studentId!: string;

    @Column({ nullable: false })
    name!: string;

    @Column({ nullable: false })
    group!: string;

    @Column({ type: 'int', nullable: false })
    year!: number;

    @Column({ unique: true, nullable: false })
    CNP!: string;

    @Column({ nullable: false })
    userId!: number;
}
