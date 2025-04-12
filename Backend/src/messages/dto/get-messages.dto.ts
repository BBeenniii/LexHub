import { IsNumber } from "class-validator";


export class GetMessagesDto {
    @IsNumber()
    conversationId: number;
}