import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Status } from '../../enums/exam.enum';
import { Teacher } from '../../teacher/entity/teacher.entity';
import { Room } from '../../room/entity/room.entity';
import { Student } from '../../student/entity/student.entity';

@Entity('exams')
export class Exam {
  @PrimaryGeneratedColumn('uuid')
  examId!: string;

  @Column({ type: 'date' })
  date!: Date;

  @Column({ nullable: false })
  duration!: string;

  @Column({ type: 'int' })
  numberOfStudents!: number;

  @Column({ type: 'time' })
  startTime!: string;

  @ManyToMany(() => Room, (room) => room.exams, { nullable: false })
  @JoinTable()
  rooms!: Room[];

  @ManyToOne(() => Teacher, (teacher) => teacher.exams, { nullable: false })
  @JoinColumn({ name: 'teacherId' })
  teacher!: Teacher;

  @ManyToOne(() => Student, (student) => student.exams, { nullable: true })
  @JoinColumn({ name: 'studentId' })
  student!: Student;

  @Column({ nullable: false })
  subject!: string;

  @Column({
    type: 'enum',
    enum: Status,
  })
  status!: Status;

  @Column({ nullable: false })
  group!: string;

  @Column({ type: 'uuid', nullable: true })
  teacherAssistent!: string | null;
}
