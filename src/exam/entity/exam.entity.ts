import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Status } from '../../enums/exam.enum';
import { Teacher } from '../../teacher/entity/teacher.entity';
import { Room } from '../../room/entity/room.entity';

@Entity('exams')
export class Exam {
  @PrimaryGeneratedColumn('uuid')
  examId!: string;

  @Column({ type: 'date' })
  date!: Date;

  @Column({ nullable: false })
  duration!: string;

  @ManyToMany(() => Room, (room) => room.exams, { nullable: true })
  @JoinTable()
  rooms!: Room[];

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
