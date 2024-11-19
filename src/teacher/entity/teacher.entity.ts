import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "../../enums/teacher.enum";
import { User } from "../../user/entity/user.entity";
import { Exam } from "../../exam/entity/exam.entity";

@Entity('teachers')
export class Teacher {
    @PrimaryGeneratedColumn('uuid')
    teacherId!: string;

    @Column()
    name!: string;

    @Column({ nullable: true })
    subject!: string;

    @Column({
        type: 'enum',
        enum: Category,
        nullable: true
    })
    category!: Category;

    @OneToOne(() => User, (user) => user.teacher, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'userId' })
    user!: User;

    @OneToMany(() => Exam, (exam) => exam.teacher)
    exams!: Exam[];
}