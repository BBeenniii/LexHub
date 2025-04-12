import { IsEmail, IsOptional, IsString, IsArray, Matches} from 'class-validator';

export class UpdateProviderDto {
    @IsOptional()
    @Matches(/^(?=.{5,})([A-Za-zÁ-űá-ű.\-]{2,}\s){1,}[A-Za-zÁ-űá-ű.\-]{2,}$/, {
      message:
        'A névnek legalább két tagból kell állnia, minden tagnak legalább 2 karakteresnek kell lennie. ' + 
        'Nem tartalmazhat számokat, ponton és kötőjelen kívül semmilyen speciális karatkert ',
    })
    name?: string;
    
    @IsOptional()
    @IsEmail({}, { message: 'Érvénytelen email cím.' })
    email?: string;

    @IsOptional()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/, {
    message:
        'A jelszónak legalább 8 karakterből kell állnia, tartalmaznia kell kis- és nagybetűt, számot és speciális karaktert. Szóköz nem lehet benne.',
    })
    password?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    country?: string;

    @IsOptional()
    @IsString()
    county?: string;

    @IsOptional()
    @IsString()
    city?: string;

    /*
    @IsOptional()
    @IsString()
    providerType?: string; */

    @IsOptional()
    @IsString()
    kasz?: string;

    @IsOptional()
    @IsArray()
    specs?: number[];
}