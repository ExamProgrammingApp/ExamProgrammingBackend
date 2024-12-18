import { DataSource } from 'typeorm';
import { Teacher } from '../entity/teacher.entity';
import { User } from '../../user/entity/user.entity';
import { Category } from '../../enums/teacher.enum';


export const seedTeachers = async (dataSource: DataSource) => {
    const teacherRepository = dataSource.getRepository(Teacher);
    const userRepository = dataSource.getRepository(User);

    // Array of names and their associated subjects and categories
    const names = [
        { baseName: 'Vasile Bordei', subject: 'Computer Science', category: Category.FIESC },
        { baseName: 'Monica Stefanuca', subject: 'Mathematics', category: Category.FIESC },
        { baseName: 'Robert Pamparau', subject: 'Physics', category: Category.MECATRONICA },
        { baseName: 'Serban Andries', subject: 'Chemistry', category: Category.MEDICINA },
    ];

    
    for (const { baseName, subject, category } of names) {
        for (let i = 1; i <= 30; i++) {
            const email = `${baseName.toLowerCase().replace(/ /g, '.')}.teacher${i}@example.com`;

            
            const user = await userRepository.findOneBy({ email });

            if (!user) {
                
                console.log(`User not found for email: ${email}`);
                continue;
            }

            
            const existingTeacher = await teacherRepository.findOneBy({ user: { email } });

            if (!existingTeacher) {
                const newTeacher = teacherRepository.create({
                    name: user.name,
                    subject,
                    category,
                    user, 
                });

                await teacherRepository.save(newTeacher);
            } else {
                console.log(`Teacher for user ${email} already exists.`);
            }
        }
    }

    const emailVasile = await userRepository.findOneBy({ email: 'vasile.bordei@student.usv.ro' });

if (emailVasile) {
    const teacherVasile = teacherRepository.create({
        name: 'Vasile Bordei',
        subject: 'Computer Science',
        category: Category.FIESC,
        user: emailVasile,
    });

    await teacherRepository.save(teacherVasile);
} else {
    console.log('User with email vasile.bordei@student.usv.ro not found.');
}
    

    
    console.log('Teachers seeded successfully.');
};