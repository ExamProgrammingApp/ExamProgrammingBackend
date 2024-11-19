import { DataSource } from 'typeorm';
import { Room } from '../entity/room.entity';
import { RoomStatus } from '../../enums/room.enum';

export async function seedRooms(dataSource: DataSource): Promise<void> {
    const roomRepository = dataSource.getRepository(Room);

    const rooms = [
        { name: 'C101', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'C102', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'C103', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'C104', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'C105', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'C106', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'C107', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'C108', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'C109', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'C201', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'C202', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'C203', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'C204', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'C205', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'C206', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'C207', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'C208', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'C209', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'C301', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'C302', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'C303', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'C304', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'C305', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'C306', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'C307', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'C308', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'C309', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'D - Amfiteatru 1', capacity: 40, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'D - Amfiteatru 2', capacity: 40, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'D - Amfiteatru 3', capacity: 40, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'D - Amfiteatru 4', capacity: 40, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'D - Amfiteatru 5', capacity: 40, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'D206', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'D207', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'D208', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'D209', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'D301', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'D302', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'D303', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'D304', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'D305', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
        { name: 'D306', capacity: 15, hour: null, status: RoomStatus.AVAILABLE },
    ];

    for (const room of rooms) {
        const existingRoom = await roomRepository.findOne({ where: { name: room.name } });
        if (!existingRoom) {
            const newRoom = roomRepository.create(room); // Creează un obiect Room
            await roomRepository.save(newRoom);
        }
    }

    console.log('Rooms have been seeded successfully!');
}