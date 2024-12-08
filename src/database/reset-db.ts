import { AppDataSource } from './data-source'; 

const resetDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Dropping schema...');
        await AppDataSource.dropDatabase(); 
        console.log('Synchronizing schema...');
        await AppDataSource.synchronize(); 
        console.log('Database reset successfully.');
    } catch (error) {
        console.error('Error resetting the database:', error);
    } finally {
        await AppDataSource.destroy();
    }
};

resetDatabase();