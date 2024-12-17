import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Status } from '../../enums/exam.enum';


@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  notificationId!: string; 

  @Column()
  message!: string;

  @ManyToOne(() => User, (user) => user.notifications)
  user!: User;

  @Column({
    type: 'enum',
    enum: Status,
  })
  type!: Status;


  @Column({ type: 'boolean', default: false })
  isRead!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}