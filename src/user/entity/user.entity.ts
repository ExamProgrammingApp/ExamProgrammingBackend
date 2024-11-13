import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Role } from '../../enums/user.enum';

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
}