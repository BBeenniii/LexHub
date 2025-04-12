import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateMessageDto {
    @IsString()
    @IsNotEmpty({ message: 'Üres üzenetet nem lehet küldeni!' })
    text: string;

    @IsNumber()
    conversationId: number;

    @IsNumber()
    senderId: number;

    @IsNumber()
    receiverId: number;
}