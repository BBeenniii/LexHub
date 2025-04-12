import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Érvénytelen email cím.' })
  email: string;

  @IsString({ message: 'A jelszó megadása kötelező.' })
  password: string;
}
