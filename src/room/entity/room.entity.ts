import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { RoomStatus } from "../../enums/room.enum";

@Entity('rooms')
export class Room {
    @PrimaryGeneratedColumn('uuid')
    roomId!: number;

    @Column({ type: 'varchar', length: 255 })
    name!: string;

    @Column({ type: 'int' })
    capacity!: number;

    @Column({ type: 'varchar', length: 10, nullable: true })
    hour!: string | null;

    @Column({
        type: 'enum',
        enum: RoomStatus,
        default: RoomStatus.AVAILABLE,
    })
    status!: RoomStatus;
}