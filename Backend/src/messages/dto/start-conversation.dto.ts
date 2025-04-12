import { IsNumber } from "class-validator";


export class StartConversationDto {
    @IsNumber()
    seekerId: number;

    @IsNumber()
    providerId: number;
}