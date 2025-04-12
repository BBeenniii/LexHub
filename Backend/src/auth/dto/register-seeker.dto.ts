import { IsEmail, IsString, Matches, IsNotEmpty, } from 'class-validator';
  
export class RegisterSeekerDto {
    @IsString()
    @IsNotEmpty({ message: 'A név megadása kötelező.' })
    @Matches(/^(?=.{5,})([A-Za-zÁ-űá-ű.\-]{2,}\s){1,}[A-Za-zÁ-űá-ű.\-]{2,}$/, {
    message:
        'A névnek legalább két tagból kell állnia, minden tagnak legalább 2 karakteresnek kell lennie. ' + 
        'Nem tartalmazhat számokat, ponton és kötőjelen kívül semmilyen speciális karatkert ',
    })
    name?: string;
  
    @IsEmail({}, { message: 'Érvénytelen email formátum.' })
    email: string;
  
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/, {
    message:
        'A jelszónak legalább 8 karakter hosszúnak kell lennie, tartalmaznia kell kis- és nagybetűt, számot és speciális karaktert. Szóköz nem lehet benne.',
    })
    password: string;
  
    @IsString()
    @IsNotEmpty({ message: 'A telefonszám megadása kötelező.' })
    phone: string;
  
    @IsString()
    @IsNotEmpty({ message: 'Az ország megadása kötelező.' })
    country: string;
  
    @IsString()
    @IsNotEmpty({ message: 'A megye megadása kötelező.' })
    county: string;
  
    @IsString()
    @IsNotEmpty({ message: 'A város megadása kötelező.' })
    city: string;
  }
  