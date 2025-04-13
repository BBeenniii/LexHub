import {
    IsEmail,
    IsString,
    IsNotEmpty,
    IsArray,
    ArrayNotEmpty,
    ValidateIf,
    IsIn,
    Matches,
  } from 'class-validator';
  import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
  
  export class RegisterProviderDto {
    @ApiProperty({
      description: 'A felhasználó teljes neve. Legalább két tagból kell állnia (pl. vezetéknév és keresztnév).',
      example: 'Dr. Kiss Dóra',
    })
    @IsString()
    @IsNotEmpty({ message: 'A név megadása kötelező.' })
    @Matches(/^(?=.{5,})([A-Za-zÁ-űá-ű.\-]{2,}\s){1,}[A-Za-zÁ-űá-ű.\-]{2,}$/, {
      message:
        'A névnek legalább két tagból kell állnia, minden tagnak legalább 2 karakteresnek kell lennie. Nem tartalmazhat számokat, ponton és kötőjelen kívül semmilyen speciális karaktert.',
    })
    name?: string;
  
    @ApiProperty({
      description: 'A felhasználó email címe, amelyre a fiók regisztrálva lesz.',
      example: 'ugyved@example.com',
    })
    @IsEmail({}, { message: 'Érvénytelen email formátum.' })
    email: string;
  
    @ApiProperty({
      description: 'Erős jelszó: legalább 8 karakter, kis- és nagybetű, szám, speciális karakter, szóköz nélkül.',
      example: 'ErősJelszó!2024',
    })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/, {
      message:
        'A jelszónak legalább 8 karakter hosszúnak kell lennie, tartalmaznia kell kis- és nagybetűt, számot és speciális karaktert. Szóköz nem lehet benne.',
    })
    password: string;
  
    @ApiProperty({
      description: 'A felhasználó telefonszáma.',
      example: '+36 20 123 4567',
    })
    @IsString()
    @IsNotEmpty({ message: 'A telefonszám megadása kötelező.' })
    phone: string;
  
    @ApiProperty({
      description: 'Az ország, ahol az ügyvéd praktizál.',
      example: 'Magyarország',
    })
    @IsString()
    @IsNotEmpty({ message: 'Az ország megadása kötelező.' })
    country: string;
  
    @ApiProperty({
      description: 'A megye, ahol az ügyvéd tevékenykedik.',
      example: 'Pest',
    })
    @IsString()
    @IsNotEmpty({ message: 'A megye megadása kötelező.' })
    county: string;
  
    @ApiProperty({
      description: 'A város, ahol az ügyvéd elérhető.',
      example: 'Budapest',
    })
    @IsString()
    @IsNotEmpty({ message: 'A város megadása kötelező.' })
    city: string;
  
    @ApiProperty({
      description: 'A felhasználó típusa: egyéni ügyvéd vagy cég.',
      example: 'individual',
      enum: ['individual', 'company'],
    })
    @IsString()
    @IsIn(['individual', 'company'], {
      message: 'A providerType csak "individual" vagy "company" lehet.',
    })
    providerType: string;
  
    @ApiPropertyOptional({
      description: 'Cégnév, ha a regisztráló egy cég nevében regisztrál.',
      example: 'Lex Legal Kft.',
    })
    @ValidateIf((o) => o.providerType === 'company')
    @IsString({ message: 'Cégnév megadása kötelező, ha céges profilt regisztrál.' })
    companyName?: string;
  
    @ApiProperty({
      description: 'Kamarai azonosító szám (KASZ).',
      example: 'AB123456',
    })
    @IsString()
    @IsNotEmpty({ message: 'A Kamarai Azonosító Szám megadása kötelező.' })
    kasz: string;
  
    @ApiProperty({
      description: 'Ügyvéd által választott szakterületek ID-jai.',
      example: [1, 3, 5],
      type: [Number],
    })
    @IsArray()
    @ArrayNotEmpty({ message: 'Legalább egy szakterület választása kötelező.' })
    specs: number[];
  }