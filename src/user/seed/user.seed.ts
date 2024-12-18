import { DataSource } from 'typeorm';
import { User } from '../entity/user.entity';
import { Role } from '../../enums/user.enum';
import bcrypt from 'bcrypt';

export const seedUsers = async (dataSource: DataSource) => {
    const userRepository = dataSource.getRepository(User);

    const emailNames = ['Vasile Bordei', 'Monica Stefanuca', 'Serban Andries', 'Robert Pamparau'];
    const namesOfUser = [
        'Andrei Popescu', 'Maria Ionescu', 'Alexandru Gheorghiu', 'Elena Dumitrescu', 
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
        'Tudor Voinea', 'Claudia Marcu', 'Sebastian Albu', 'Corina Tache', 
        'Emanuel Iliescu', 'Carmen Gheorghiu', 'Victor Munteanu', 'Silvia Preda', 
        'Florentina Marin', 'Constantin Dobre', 'Daniel Serban', 'Marina Barbu', 
        'Cosmina Apostol', 'Robert Calinescu', 'Georgiana Luca', 'Stefania Olaru', 
        'Lucian Tanase', 'Octavia Petrescu', 'Sofia Stoica', 'Vasile Croitoru', 
        'Ileana Matei', 'Dan Gheorghiu', 'Ionela Toma', 'Felix Enache', 
        'Ovidiu Marinescu', 'Sabina Vlad', 'Claudia Zamfir', 'Adela Draghici', 
        'Petru Apostol', 'Viorel Stan', 'Ruxandra Filip', 'Marius Popa', 
        'Cezar Constantinescu', 'Laura Pana', 'Ana Bucur', 'Ioan Rotaru', 
        'Daniela Manole', 'Emilian Sava', 'Natalia Moise', 'Lorena Serban', 
        'Gabriel Lungu', 'Teodora Neagu', 'Ion Bucur', 'Alin Luca', 
        'Daria Tache', 'Andreea Lungu', 'Paul Marin', 'Irina Vasilescu', 
        'Stefan Tanase', 'Ramona Iliescu', 'Cristian Pavel', 'Ana Munteanu', 
        'Tiberiu Oprea', 'Elena Barbu', 'Gheorghe Radulescu', 'Radu Stancu', 
        'Carmen Vasilescu', 'Denis Dobre', 'Mihai Calinescu', 'Monica Tanase',
        'Anastasia Iacob', 'Robert Mihailescu', 'Evelin Tataru', 'Florin Voiculescu'
    ];
    const additionalNames = [
        'Alina Popescu', 'Vlad Ionescu', 'Eliza Gheorghiu', 'Sergiu Dumitrescu', 
        'Andreea Stoian', 'Marius Matei', 'Cristina Rusu', 'Radu Enescu', 
        'Adrian Marinescu', 'Simona Vlad', 'Sorina Toma', 'Ana Maria Grigore', 
        'Victor Petrescu', 'Bianca Dumitrescu', 'Paul Ene', 'Laura Mihai', 
        'Nicoleta Ion', 'Daniel Marin', 'Adriana Voicu', 'Alexandru Bucur', 
        'Camelia Iancu', 'Stefan Popa', 'Roxana Vasile', 'Liviu Calin', 
        'Cristina Pop', 'George Iacob', 'Silvia Neagu', 'Claudiu Zamfir', 
        'Oana Tache', 'Bogdan Stan', 'Monica Oprea', 'Catalin Serban', 
        'Gabriela Marinescu', 'Valentin Radu', 'Monica Enache', 'Dragos Mateescu', 
        'Antonia Preda', 'Eduard Tanase', 'Loredana Apostol', 'Ionut Moldovan', 
        'Adriana Vasilescu', 'Teodor Cristea', 'Victoria Barbu', 'Raul Stefan', 
        'Evelina Toma', 'Florin Gheorghe', 'Mihaela Luca', 'Cosmin Lupu', 
        'Maria Filip', 'Dan Rusu', 'Ioana Stoica', 'Razvan Marin', 
        'Anca Pop', 'Darius Ene', 'Andreea Voinea', 'Tudor Pavel', 
        'Claudia Gheorghe', 'Sebastian Calinescu', 'Corina Dobre', 'Anastasia Stan', 
        'Carmen Calin', 'Victor Bucur', 'Silvia Petrescu', 'Florentina Iliescu', 
        'Constantin Rotaru', 'Daniel Enescu', 'Marina Luca', 'Cosmina Barbu', 
        'Robert Radu', 'Georgiana Mihai', 'Stefania Croitoru', 'Lucian Apostol', 
        'Octavia Dumitru', 'Sofia Vasilescu', 'Vasile Gheorghe', 'Ileana Enache', 
        'Dan Zamfir', 'Ionela Marin', 'Felix Stan', 'Ovidiu Neagu', 
        'Sabina Apostol', 'Claudia Grigorescu', 'Adela Iacob', 'Petru Bucur', 
        'Viorel Matei', 'Ruxandra Dobre', 'Marius Lupu', 'Cezar Preda', 
        'Laura Voicu', 'Ana Marinescu', 'Ioan Tanase', 'Daniela Ene', 
        'Emilian Rotaru', 'Natalia Stefan', 'Lorena Filip', 'Gabriel Rusu', 
        'Teodora Marinescu', 'Ion Croitoru', 'Alin Iliescu', 'Daria Zamfir', 
        'Andreea Stancu', 'Paul Dumitrescu', 'Irina Voinea', 'Stefan Moldovan', 
        'Ramona Gheorghe', 'Cristian Oprea', 'Ana Barbu', 'Tiberiu Apostol', 
        'Elena Bucur', 'Gheorghe Stan', 'Radu Ionescu', 'Carmen Tanase', 
        'Denis Dumitrescu', 'Mihai Cristea', 'Monica Vasile', 'Roxana Rotaru',
        'Florina Tănase', 'Sorin Vasile', 'Ioana Stroe', 'Adrian Lăzărescu'
    ];
    const roles = [
        { role: Role.TEACHER, count: 30 },
        { role: Role.STUDENT, count: 15 },
        { role: Role.HEADSTUDENT, count: 15 },
    ];

    let teacherIndex = 0;
    let studentIndex = 0;

    for (const emailname of emailNames) {
        const uniqueTeacherNames = namesOfUser.slice(teacherIndex, teacherIndex + 30);
        teacherIndex += 30;

        for (const { role, count } of roles) {
            for (let i = 1; i <= count; i++) {
                const email = `${emailname.toLowerCase().replace(/ /g, '.')}.${role.toLowerCase()}${i}@example.com`;
                const password = 'test123';

                const existingUser = await userRepository.findOneBy({ email });

                if (!existingUser) {
                    const hashedPassword = await bcrypt.hash(password, 10);

                    let uniqueName = '';
                    if (role === Role.TEACHER) {
                        uniqueName = uniqueTeacherNames[(i - 1) % uniqueTeacherNames.length];
                    } else {
                        uniqueName = additionalNames[studentIndex];
                        studentIndex++;
                    }

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

    const teacherVasile = userRepository.create({
        name: 'Vasile Bordei',
        email: 'vasile.bordei@student.usv.ro',
        password: await bcrypt.hash('test123', 10),
        role: Role.TEACHER,
    });
    
    const studentMonica = userRepository.create({
        name: 'Monica Stefanuca',
        email: 'monica.stefanuca1@student.usv.ro',
        password: await bcrypt.hash('test123', 10),
        role: Role.HEADSTUDENT,
    });

    const headstudentSerban = userRepository.create({
        name: 'Serban Andries',
        email: 'george.andries@student.usv.ro',
        password: await bcrypt.hash('test123', 10),
        role: Role.HEADSTUDENT,
    });

    const headstudentRobert = userRepository.create({
        name: 'Robert Pamparau',
        email: 'robert.pamparau@student.usv.ro',
        password: await bcrypt.hash('test123', 10),
        role: Role.HEADSTUDENT,
    });
    await userRepository.save(teacherVasile);
    await userRepository.save(studentMonica);
    await userRepository.save(headstudentSerban);
    await userRepository.save(headstudentRobert);

    console.log('Users seeded successfully.');
};