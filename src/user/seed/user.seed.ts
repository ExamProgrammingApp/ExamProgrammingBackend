import { DataSource } from 'typeorm';
import { User } from '../entity/user.entity';
import { Role } from '../../enums/user.enum';
import bcrypt from 'bcrypt';
 
export const seedUsers = async (dataSource: DataSource) => {
    const userRepository = dataSource.getRepository(User);
 
    const emailNames = ['Vasile Bordei', 'Monica Stefanuca', 'Serban Andries', 'Robert Pamparau'];
    const namesOfUser = ['Andrei Popescu', 'Maria Ionescu', 'Alexandru Gheorghiu', 'Elena Dumitrescu', 
        'Mihai Stoica', 'Ioana Matei', 'Cristian Ciobanu', 'Raluca Enache', 
        'Gabriel Marinescu', 'Diana Vlad', 'Sorin Toma', 'Ana Grigorescu', 
        'Vlad Petrescu', 'Bianca Serban', 'Paul Dobre', 'Laura Radulescu', 
        'Nicolae Iliescu', 'Daniela Lungu', 'Adrian Apostol', 'Alexandra Voicu', 
        'Mihnea Bucur', 'Camelia Draghici', 'Stefan Calinescu', 'Roxana Barbu', 
        'Liviu Vasilescu', 'Cristina Munteanu', 'George Tanase', 'Simona Neagu', 
        'Claudiu Oprea', 'Oana Luca', 'Bogdan Anghel', 'Alina Rusu', 
        'Catalin Lupu', 'Gabriela Cazan', 'Valentin Grecu', 'Monica Filip', 
        'Dragos Stan', 'Antonia Stancu', 'Eduard Dumitru', 'Loredana Zamfir', 
        'Ionut Preda', 'Adriana Moldovan', 'Teodor Vasilescu', 'Victoria Pana', 
        'Raul Cristea', 'Evelina Rotaru', 'Florin Constantinescu', 'Mihaela Popa', 
        'Cosmin Sava', 'Maria Bucur', 'Dan Pavel', 'Ioana Croitoru', 
        'Razvan Manole', 'Anca Olaru', 'Darius Stefan', 'Andreea Moise', 
        'Tudor Voinea', 'Claudia Marcu', 'Sebastian Albu', 'Corina Tache'];
    const roles = [
        { role: Role.TEACHER, count: 30 },
        { role: Role.STUDENT, count: 15 },
        { role: Role.HEADSTUDENT, count: 15 },
    ];
    
    let nameIndex = 0; // Initialize an index for unique name assignment

    for (const emailname of emailNames) {
        for (const { role, count } of roles) {
            for (let i = 1; i <= count; i++) {
                const email = `${emailname.toLowerCase().replace(/ /g, '.')}.${role.toLowerCase()}${i}@example.com`;
                const password = 'test123';
 
                const existingUser = await userRepository.findOneBy({ email });
 
                if (!existingUser) {
                    const hashedPassword = await bcrypt.hash(password, 10);
 
                    // Assign a unique name based on the current index
                    const uniqueName = namesOfUser[nameIndex % namesOfUser.length];
                    nameIndex++; // Increment the index for the next user

                    const newUser = userRepository.create({
                        name: uniqueName,
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