import { DataSource } from 'typeorm';
import { Teacher } from '../entity/teacher.entity';
import { User } from '../../user/entity/user.entity';
import { Category } from '../../enums/teacher.enum';

export const seedTeachers = async (dataSource: DataSource) => {
    const teacherRepository = dataSource.getRepository(Teacher);
    const userRepository = dataSource.getRepository(User);

   
    const teacherUsers = await userRepository.findBy({ role: 'teacher' });


    const teacherDetails: { [key: string]: { subject: string; category: Category } } = {
        'vasile.teacher@example.com': { subject: 'Computer Science', category: Category.FIESC },
        'monica.teacher@example.com': { subject: 'Mathematics', category: Category.FIESC },
        'robert.teacher@example.com': { subject: 'Physics', category: Category.MECATRONICA },
        'serban.teacher@example.com': { subject: 'Chemistry', category: Category.MEDICINA },
    };

    for (const user of teacherUsers) {
        
        const existingTeacher = await teacherRepository.findOneBy({ user: { email: user.email } });

        if (!existingTeacher) {
            const details = teacherDetails[user.email];

            const newTeacher = teacherRepository.create({
                name: user.name,
                subject: details.subject,
                category: details.category,
                user: user, 
            });

            await teacherRepository.save(newTeacher);
        } else {
            console.log(`Teacher for user ${user.email} already exists.`);
        }
    }

    console.log('Teachers seeded successfully.');
};