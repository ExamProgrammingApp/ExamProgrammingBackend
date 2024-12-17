// import { DataSource } from 'typeorm';
// import { Exam } from '../entity/exam.entity';
// import { Teacher } from '../../teacher/entity/teacher.entity';
// import { Room } from '../../room/entity/room.entity';
// import { Status } from '../../enums/exam.enum';

// export const seedExams = async (dataSource: DataSource) => {
//     const examRepository = dataSource.getRepository(Exam);
//     const teacherRepository = dataSource.getRepository(Teacher);
//     const roomRepository = dataSource.getRepository(Room);

    
//     const teachers = await teacherRepository.find();
//     if (teachers.length === 0) {
//         console.error('No teachers found in the database. Please seed teachers first.');
//         return;
//     }

    
//     const rooms = await roomRepository.find();
//     if (rooms.length === 0) {
//         console.error('No rooms found in the database. Please seed rooms first.');
//         return;
//     }

    
//     const subjects = ['IP', 'SIEP', 'CMO', 'PBD', 'PRTR'];
//     const groups = ['Group A', 'Group B', 'Group C'];

//     const exams: Partial<Exam>[] = [];

    
//     teachers.forEach((teacher, teacherIndex) => {
//         for (let i = 0; i < 5; i++) { 
//             const subjectIndex = (teacherIndex + i) % subjects.length;
//             const groupIndex = (teacherIndex + i) % groups.length;
//             const date = new Date(2024, 11, 10 + teacherIndex * 5 + i); 

//             exams.push({
//                 subject: subjects[subjectIndex],
//                 date,
//                 duration: `${90 + i * 10}`, 
//                 numberOfStudents: 20 + i * 5, 
//                 startTime: `0${9 + i}:00:00`, 
//                 status: Status.PENDING,
//                 group: groups[groupIndex],
//                 teacher,
//                 rooms: [rooms[i % rooms.length]], 
//             });
//         }
//     });

    
//     for (const exam of exams) {
//         const existingExam = await examRepository.findOneBy({ subject: exam.subject, date: exam.date, teacher: exam.teacher });
//         if (!existingExam) {
//             const newExam = examRepository.create(exam);
//             await examRepository.save(newExam);
//         }
//     }

//     console.log('Exams seeded successfully.');
// };