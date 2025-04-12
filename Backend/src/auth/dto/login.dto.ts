import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'A felhasználó email címe, amelyre a fiók regisztrálva van.',
    example: 'valaki@example.com',
  })
  @IsEmail({}, { message: 'Érvénytelen email cím.' })
  email: string;

  @ApiProperty({
    description: 'A fiókhoz tartozó jelszó.',
    example: 'titkosjelszo123',
  })
  @IsString({ message: 'A jelszó megadása kötelező.' })
  @MinLength(6, { message: 'A jelszónak legalább 6 karakter hosszúnak kell lennie.' })
  password: string;
}