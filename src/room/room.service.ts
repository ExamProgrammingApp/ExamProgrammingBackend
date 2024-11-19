import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomStatus } from '../enums/room.enum';
import { Room } from './entity/room.entity';

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>,
    ) { }



    async findAll(): Promise<Room[]> {
        return this.roomRepository.find();
    }


    async findOne(id: number): Promise<Room> {
        const room = await this.roomRepository.findOne({ where: { roomId: id } });
        if (!room) {
            throw new NotFoundException(`Room not found`);
        }
        return room;
    }


    async findByCapacity(capacity: number): Promise<Room[]> {
        const rooms = await this.roomRepository.find({
            where: { capacity },
        });

        if (rooms.length === 0) {
            throw new NotFoundException(`No rooms found with capacity: ${capacity}`);
        }

        return rooms;
    }


    async findAvailableRooms(): Promise<Room[]> {
        const rooms = await this.roomRepository.find({
            where: { status: RoomStatus.AVAILABLE },
        });

        if (rooms.length === 0) {
            throw new NotFoundException(`No available rooms found`);
        }

        return rooms;
    }

}