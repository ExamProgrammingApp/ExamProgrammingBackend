import { DataSource } from 'typeorm';
import { User } from '../entity/user.entity';
import { Role } from '../../enums/user.enum';
import bcrypt from 'bcrypt';
 
export const seedUsers = async (dataSource: DataSource) => {
    const userRepository = dataSource.getRepository(User);
 
   
    const names = ['Vasile Bordei', 'Monica Stefanuca', 'Serban Andries', 'Robert Pamparau'];
    const roles = [
        { role: Role.TEACHER, count: 30 },
        { role: Role.STUDENT, count: 15 },
        { role: Role.HEADSTUDENT, count: 15 },
    ];
 
    for (const name of names) {
        for (const { role, count } of roles) {
            for (let i = 1; i <= count; i++) {
                const email = `${name.toLowerCase().replace(/ /g, '.')}.${role.toLowerCase()}${i}@example.com`;
                const password = 'test123';
 
               
                const existingUser = await userRepository.findOneBy({ email });
 
                if (!existingUser) {
                    const hashedPassword = await bcrypt.hash(password, 10);
 
                    const newUser = userRepository.create({
                        name,
                        email,
                        password: hashedPassword,
                        role,
                    });
 
                    await userRepository.save(newUser);
                } else {
                    console.log(`User with email ${email} already exists.`);
                }
            }
        }
    }
 
    console.log('Users seeded successfully.');
};