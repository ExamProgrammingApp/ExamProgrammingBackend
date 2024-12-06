import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsString, IsUUID } from "class-validator";
import { Column } from "typeorm";

export class UpdateRoomDto {
    @ApiProperty({
        example: ['room-uuid-1', 'room-uuid-2'],
        description: 'An array of room IDs to assign to the exam',
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsUUID('4', { each: true })
    roomIds!: string[];

    @ApiProperty()
    @IsUUID()
    teacherAssistent!: string;
}