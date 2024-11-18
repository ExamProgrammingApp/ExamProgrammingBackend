import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateRoomDto {
    @ApiProperty({
        example: 'Room 101',
        description: 'The room where the exam will be held',
    })
    @IsString()
    room!: string;
}