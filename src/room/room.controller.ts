import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { RoomService } from "./room.service";
import { Room } from "./entity/room.entity";

@ApiTags('rooms')
@Controller('rooms')
export class RoomController {
    constructor(private readonly roomService: RoomService) { }


    @Get()
    @ApiOperation({ summary: 'Get all rooms' })
    async findAll(): Promise<Room[]> {
        return this.roomService.findAll();
    }


    @Get(':id')
    @ApiOperation({ summary: 'Get room by ID' })
    @ApiParam({ name: 'id', type: 'number', description: 'ID of the room' })
    async findOne(@Param('id') id: number): Promise<Room> {
        return this.roomService.findOne(id);
    }


    @Get('capacity/:capacity')
    @ApiOperation({ summary: 'Find rooms by capacity' })
    @ApiParam({ name: 'capacity', type: 'number', description: 'Capacity of the room', example: 10 })
    async findByCapacity(@Param('capacity') capacity: number): Promise<Room[]> {
        return this.roomService.findByCapacity(capacity);
    }


    @Get('/available/all')
    @ApiOperation({ summary: 'Get all available rooms' })
    async findAvailableRooms(): Promise<Room[]> {
        return this.roomService.findAvailableRooms();
    }
}