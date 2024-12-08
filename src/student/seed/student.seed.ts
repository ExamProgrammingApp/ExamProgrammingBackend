import { DataSource } from 'typeorm';
import { Student } from '../entity/student.entity';
import { User } from '../../user/entity/user.entity';

export const seedStudents = async (dataSource: DataSource) => {
    const studentRepository = dataSource.getRepository(Student);
    const userRepository = dataSource.getRepository(User);

   
    const studentDetails: { [key: string]: { name: string; group: string; year: number; CNP: string } } = {
        'vasile.student@example.com': { name: 'Vasile Bordei', group: 'CS-A1', year: 1, CNP: '1234567890123' },
        'monica.student@example.com': { name: 'Monica Popescu', group: 'CS-B2', year: 2, CNP: '2345678901234' },
        'robert.student@example.com': { name: 'Robert Ionescu', group: 'CS-A3', year: 3, CNP: '3456789012345' },
        'serban.student@example.com': { name: 'Serban Mihai', group: 'CS-C1', year: 4, CNP: '4567890123456' },
        'vasile.headstudent@example.com': { name: 'Vasile Bordei Head', group: 'CS-A1', year: 4, CNP: '5678901234567' },
        'monica.headstudent@example.com': { name: 'Monica Popescu Head', group: 'CS-B2', year: 4, CNP: '6789012345678' },
        'robert.headstudent@example.com': { name: 'Robert Ionescu Head', group: 'CS-A3', year: 4, CNP: '7890123456789' },
        'serban.headstudent@example.com': { name: 'Serban Mihai Head', group: 'CS-C1', year: 4, CNP: '8901234567890' },
    };

    for (const [email, details] of Object.entries(studentDetails)) {
       
        const user = await userRepository.findOneBy({ email });

        if (!user) {
            console.error(`User not found for email: ${email}`);
            continue; 
        }

        
        const existingStudent = await studentRepository.findOneBy({ user: { userId: user.userId } });

        if (!existingStudent) {
            const newStudent = studentRepository.create({
                name: details.name,
                group: details.group,
                year: details.year,
                CNP: details.CNP,
                user: user, 
            });

            await studentRepository.save(newStudent);
        } else {
            console.log(`Student for email ${email} already exists.`);
        }
    }

    console.log('Student seeding completed.');
};