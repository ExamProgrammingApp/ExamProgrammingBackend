import { DataSource } from 'typeorm';
import { AppDataSource } from './database/data-source';
import { seedUsers } from './user/seed/user.seed'; 
import { seedTeachers } from './teacher/seed/teacher.seed'; 
import { seedStudents } from './student/seed/student.seed';
import { seedRooms } from './room/seed/room.seed'; 
import { seedExams } from './exam/seed/exam.seed';

const runSeed = async () => {
    console.log(AppDataSource.options.entities);
    const dataSource: DataSource = await AppDataSource.initialize();
    
    try {
        // Run all seeds in the required order
        await seedUsers(dataSource);
        console.log('Users seeded successfully.');

        await seedTeachers(dataSource);
        console.log('Teachers seeded successfully.');

        await seedStudents(dataSource);
        console.log('Students seeded successfully.');

        await seedRooms(dataSource);
        console.log('Rooms seeded successfully.');

        await seedExams(dataSource);
        console.log('Exams seeded successfully.');

        console.log('All seeding completed successfully.');
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await dataSource.destroy();
    }
};

runSeed();