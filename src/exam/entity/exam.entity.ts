import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Status } from '../../enums/exam.enum';
import { Teacher } from '../../teacher/entity/teacher.entity';

@Entity('exams')
export class Exam {
  @PrimaryGeneratedColumn('uuid')
  examId!: string;

  @Column({ type: 'date' })
  date!: Date;

  @Column({ nullable: false })
  duration!: string;

  @Column({ nullable: true })
  room!: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.exams, { nullable: false })
  @JoinColumn({ name: 'teacherId' })
  teacher!: Teacher;

  @Column({ nullable: false })
  subject!: string;

  @Column({
    type: 'enum',
    enum: Status,
  })
  status!: Status;

  @Column({ nullable: false })
  group!: string;
}
