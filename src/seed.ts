import { DataSource } from 'typeorm';
import { seedRooms } from './room/seed/room.seed';
import { AppDataSource } from './database/data-source';

const runSeed = async () => {
    const dataSource: DataSource = await AppDataSource.initialize();

    try {
        await seedRooms(dataSource);
        console.log('Seeding completed.');
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await dataSource.destroy();
    }
};

runSeed();