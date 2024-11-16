import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Status } from '../../enums/exam.enum';

@Entity('exams')
export class Exam {
  @PrimaryGeneratedColumn()
  examId!: number;

  @Column({ type: 'date' })
  date!: Date;

  @Column({ nullable: false })
  duration!: string;

  @Column({ nullable: false })
  room!: string;

  @Column({ nullable: false })
  teacher!: string;

  @Column({ nullable: false })
  subject!: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status!: Status;

  @Column({ nullable: false })
  group!: string;
}
