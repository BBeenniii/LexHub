import { IsOptional, IsNumber, IsString, ValidateIf } from 'class-validator';

export class LawyerSearchDto {
  @IsNumber()
  specialtyId: number;

  // strict validation policy kell, hogy egyszerre ne lehessen mind a 3 féle képpen keresni
  @ValidateIf((o) => o.lat !== undefined || o.lng !== undefined)
  @IsNumber()
  @IsOptional()
  lat?: number;

  @ValidateIf((o) => o.lat !== undefined || o.lng !== undefined)
  @IsNumber()
  @IsOptional()
  lng?: number;

  @ValidateIf((o) => o.city === undefined && o.lat === undefined && o.lng === undefined)
  @IsString()
  @IsOptional()
  county?: string;

  @ValidateIf((o) => o.county === undefined && o.lat === undefined && o.lng === undefined)
  @IsString()
  @IsOptional()
  city?: string;
}