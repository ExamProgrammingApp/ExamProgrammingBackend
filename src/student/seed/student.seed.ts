import { DataSource } from 'typeorm';
import { Student } from '../entity/student.entity';
import { User } from '../../user/entity/user.entity';

export const seedStudents = async (dataSource: DataSource) => {
    const studentRepository = dataSource.getRepository(Student);
    const userRepository = dataSource.getRepository(User);

    // Define base names for students and head students
    const names = ['Vasile Bordei', 'Monica Stefanuca', 'Robert Pamparau', 'Serban Andries'];

    // Generate student and head student details dynamically
    const studentDetails: { email: string; group: string; year: number; CNP: string }[] = [];
    let cnpCounter = 1234567890123;

    for (const name of names) {
        for (let i = 1; i <= 15; i++) {
            // Students
            studentDetails.push({
                email: `${name.toLowerCase().replace(/ /g, '.')}.student${i}@example.com`,
                group: `CS-${String.fromCharCode(65 + (i % 4))}${i}`,
                year: (i % 4) + 1, // Years 1 to 4
                CNP: (cnpCounter++).toString(),
            });

            // Head Students
            studentDetails.push({
                email: `${name.toLowerCase().replace(/ /g, '.')}.headstudent${i}@example.com`,
                group: `CS-${String.fromCharCode(65 + (i % 4))}${i}`,
                year: 4, // Head students are in year 4
                CNP: (cnpCounter++).toString(),
            });
        }
    }

    // Seed students and head students
    for (const details of studentDetails) {
        const user = await userRepository.findOneBy({ email: details.email });

        if (!user) {
            console.error(`User not found for email: ${details.email}`);
            continue;
        }

        const existingStudent = await studentRepository.findOneBy({ user: { userId: user.userId } });

        if (!existingStudent) {
            const newStudent = studentRepository.create({
                name: user.name,
                group: details.group,
                year: details.year,
                CNP: details.CNP,
                user: user,
            });

            await studentRepository.save(newStudent);
        } else {
            console.log(`Student for email ${details.email} already exists.`);
        }
    }
    const userMonica = await userRepository.findOneBy({ email: 'monica.stefanuca1@student.usv.ro' });
    if (userMonica) {
        const studentMonica = studentRepository.create({
            name: 'Monica Stefanuca',
            group: 'CS-A1',
            year: 4,
            CNP: (cnpCounter++).toString(),
            user: userMonica,
        });
    
        await studentRepository.save(studentMonica);
    } else {
        console.log('User not found');
    }

    const userRobert = await userRepository.findOneBy({ email: 'robert.pamparau@student.usv.ro' });
    if (userRobert) {
        const studentRobert = studentRepository.create({
            name: 'Robert Pamparau',
            group: 'CS-A1',
            year: 4,
            CNP: (cnpCounter++).toString(),
            user: userRobert,
        });
    
        await studentRepository.save(studentRobert);
    } else {
        console.log('User not found');
    }

    const userSerban = await userRepository.findOneBy({ email: 'george.andries@student.usv.ro' });
    if (userSerban) {
        const studentSerban = studentRepository.create({
            name: 'Serban Andries',
            group: 'CS-A1',
            year: 4,
            CNP: (cnpCounter++).toString(),
            user: userSerban,
        });
    
        await studentRepository.save(studentSerban);
    } else {
        console.log('User not found');
    }

    console.log('Student and head student seeding completed.');
};