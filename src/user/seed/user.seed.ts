import { DataSource } from 'typeorm';
import { User } from '../entity/user.entity';
import { Role } from '../../enums/user.enum';
import bcrypt from 'bcrypt';

export const seedUsers = async (dataSource: DataSource) => {
    const userRepository = dataSource.getRepository(User);

    
    const users = [
        {
            name: 'Vasile Bordei',
            email: 'vasile.teacher@example.com',
            password: 'test123', 
            role: Role.TEACHER,
        },
        {
            name: 'Monica Stefanuca',
            email: 'monica.teacher@example.com',
            password: 'test123',
            role: Role.TEACHER,
        },
        {
            name: 'Robert Pamparau',
            email: 'robert.teacher@example.com',
            password: 'test123',
            role: Role.TEACHER,
        },
        {
            name: 'Serban Andries',
            email: 'serban.teacher@example.com',
            password: 'test123',
            role: Role.TEACHER,
        },
        {
            name: 'Vasile Bordei',
            email: 'vasile.student@example.com',
            password: 'test123',
            role: Role.STUDENT,
        },
        {
            name: 'Monica Stefanuca ',
            email: 'monica.student@example.com',
            password: 'test123',
            role: Role.STUDENT,
        },
        {
            name: 'Robert Pamparau',
            email: 'robert.student@example.com',
            password: 'test123',
            role: Role.STUDENT,
        },
        {
            name: 'Serban Andries',
            email: 'serban.student@example.com',
            password: 'test123',
            role: Role.STUDENT,
        },
        {
            name: 'Vasile Bordei',
            email: 'vasile.headstudent@example.com',
            password: 'test123',
            role: Role.HEADSTUDENT,
        },
        {
            name: 'Monica Stefanuca ',
            email: 'monica.headstudent@example.com',
            password: 'test123',
            role: Role.HEADSTUDENT,
        },
        {
            name: 'Robert Pamparau',
            email: 'robert.headstudent@example.com',
            password: 'test123',
            role: Role.HEADSTUDENT,
        },
        {
            name: 'Serban Andries',
            email: 'serban.headstudent@example.com',
            password: 'test123',
            role: Role.HEADSTUDENT,
        },
    ];

    for (const userData of users) {
        const existingUser = await userRepository.findOneBy({ email: userData.email });

        if (!existingUser) {
            // Hash the password before saving the user
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            const newUser = userRepository.create({
                name: userData.name,
                email: userData.email,
                password: hashedPassword,
                role: userData.role,
            });

            await userRepository.save(newUser);
        } else {
            console.log(`User with email ${userData.email} already exists.`);
        }
    }

    console.log('Users seeded successfully.');
};