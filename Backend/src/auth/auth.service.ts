import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { UserSeeker } from './entities/userSeeker.entity';
import { UserProvider } from './entities/userProvider.entity';
import { LawyerType } from './entities/lawyerType.entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import axios from 'axios';
import { LoginDto } from './dto/login.dto';
import { RegisterProviderDto } from './dto/register-provider.dto';
import { RegisterSeekerDto } from './dto/register-seeker.dto';
import { UpdateSeekerDto } from './dto/update-seeker.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { LocationValidatorService } from 'src/location-validator/location-validator.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserSeeker) private seekerRepo: Repository<UserSeeker>,
    @InjectRepository(UserProvider) private providerRepo: Repository<UserProvider>,
    @InjectRepository(LawyerType) private lawyerTypeRepo: Repository<LawyerType>,
    private configService: ConfigService,
    private locationValidator: LocationValidatorService
  ) {}

  // getCoordinatesFromCity
  // Mivel csak magyarországon "kompatiblis" ezért az ország statikus
  private async getCoordinatesFromCity(city: string, country = 'Hungary'): Promise<{ lat: number, lng: number }> {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${city},${country}&key=${this.configService.get('OPENCAGE_API_KEY')}`;
  
    const geoRes = await axios.get(url);
    const result = geoRes.data?.results?.[0];
  
    if (!result || !result.geometry) {
      throw new Error(`Nem sikerült lekérni a koordinátákat: ${city}, ${country}`);
    }
  
    const { lat, lng } = result.geometry;
    return { lat, lng };
  }  

  // CheckEmailConflict
  private async checkEmailConflict(email: string) {
    const seeker = await this.seekerRepo.findOne({ where: { email } });
    if (seeker) {
      throw new BadRequestException('Ez az email cím már használatban van!');
    }
  
    const provider = await this.providerRepo.findOne({ where: { email } });
    if (provider) {
      throw new BadRequestException('Ez az email cím már használatban van!');
    }
  }
  
  // RegisterSeeker
  async registerSeeker(dto: RegisterSeekerDto) {
    await this.checkEmailConflict(dto.email);

    // city & county validáció
    if (dto.city || dto.county) {
      await this.locationValidator.validateCityAndCounty(
        dto.city ?? '',
        dto.county ?? ''
      );
    }

    // jelszó hashaelés és mentés
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const seeker = this.seekerRepo.create({ ...dto, password: hashedPassword });
    await this.seekerRepo.save(seeker);
    return { message: 'Sikeres regisztráció' };
  }

  // registerProvider
  async registerProvider(dto: RegisterProviderDto) {
    await this.checkEmailConflict(dto.email);

    // kasz és specs (szakterület(ek) id(jai)) validáció
    const existingKASZ = await this.providerRepo.findOne({ where: { kasz: dto.kasz } });
    if (existingKASZ) throw new BadRequestException('Ez a KASZ szám már használatban van!');

    const validSpecs = await this.lawyerTypeRepo.findByIds(dto.specs);
    if (validSpecs.length !== dto.specs.length) throw new BadRequestException('Nem létező szakterület!');

    // Regisztrációkor megadott város alapján koordináták mentése a "nerby" kereséshez
    const { lat, lng } = await this.getCoordinatesFromCity(dto.city);
    // city & county validáció
    if (dto.city || dto.county) {
      await this.locationValidator.validateCityAndCounty(
        dto.city ?? '',
        dto.county ?? ''
      );
    }

    //jelszó hashelés és adatok mentése 
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const provider = new UserProvider();
    Object.assign(provider, {
      ...dto,
      password: hashedPassword,
      specs: JSON.stringify(dto.specs),
      lat,
      lng,
    });
    await this.providerRepo.save(provider);
    return { message: 'Sikeres regisztráció' };
  }

  // login
  async login({ email, password }: LoginDto) {
    // Mivel nem lehet ugyanazzal az emailel mindkét userTypeot regisztrálni 
    // ezért egyszerűn meghatározható a felhasználó típusa
    const seeker = await this.seekerRepo.findOne({ where: { email } });
    if (seeker && await bcrypt.compare(password, seeker.password)) {
      return { message: 'Sikeres bejelentkezés', user: seeker, userType: 'seeker' };
    }

    const provider = await this.providerRepo.findOne({ where: { email } });
    if (provider && await bcrypt.compare(password, provider.password)) {
      return { message: 'Sikeres bejelentkezés', user: provider, userType: 'provider' };
    }

    throw new UnauthorizedException('Hibás e-mail vagy jelszó');
  }

  // getSeekerProfile
  async getSeekerProfile(id: number) {
    const seeker = await this.seekerRepo.findOne({ where: { id } });
    if (!seeker) throw new NotFoundException('A felhasználó (Seeker) nem található.');
    return { ...seeker, userType: 'seeker' };
  }
  
  // getProviderProfile
  async getProviderProfile(id: number) {
    const provider = await this.providerRepo.findOne({ where: { id } });
    if (!provider) throw new NotFoundException('A felhasználó (Provider) nem található.');
    const specIds = JSON.parse(provider.specs || '[]');
    const specEntities = await this.lawyerTypeRepo.findByIds(specIds);
    return {
      ...provider,
      specs: specIds,
      specNames: specEntities.map((s) => s.type),
      userType: 'provider',
    };
  }

  // updateSeekerProfile
  async updateSeekerProfile(id: number, updateData: UpdateSeekerDto) {
    // Ellenőrzés biztos létezik-e a profil
    const seeker = await this.seekerRepo.findOne({ where: { id } });
    if (!seeker) {
      throw new NotFoundException('A felhasználó (Seeker) nem található.');
    }

    // email validáció
    await this.checkEmailConflict(updateData.email ?? '');

    // City & County validáció
    if (updateData.city || updateData.county) {
      await this.locationValidator.validateCityAndCounty(
        updateData.city ?? '',
        updateData.county ?? ''
      );
    }

    // Jelszó változtatás új jelszó + régi megadása
    if (updateData.newPassword) {
      if (!updateData.currentPassword) {
        throw new BadRequestException('A jelenlegi jelszót is meg kell adni a módosításhoz.');
      }

      const isMatch = await bcrypt.compare(updateData.currentPassword, seeker.password);
      if (!isMatch) {
        throw new BadRequestException('A megadott jelszó nem egyezik a jelenlegi jelszóval.');
      }

      seeker.password = await bcrypt.hash(updateData.newPassword, 10);
    }

    // módosított adatok mentése
    Object.assign(seeker, updateData);
    await this.seekerRepo.save(seeker);
    return { message: 'A profil frissítve.' };
  }

  // updateProviderProfile
  async updateProviderProfile(id: number, updateData: UpdateProviderDto) {
    // Ellenőrzés biztos létezik-e a profil
    const provider = await this.providerRepo.findOne({ where: { id } });
    if (!provider) {
      throw new NotFoundException('A felhasználó (Provider) nem található.');
    }

    // email validálás
    await this.checkEmailConflict(updateData.email ?? '');

    // city & county validálás
    if (updateData.city || updateData.county) {
      await this.locationValidator.validateCityAndCounty(
        updateData.city ?? '',
        updateData.county ?? ''
      );
    }

    // Jelszó változtatás új jelszó + régi megadása
    if (updateData.newPassword) {
      if (!updateData.currentPassword) {
        throw new BadRequestException('A jelenlegi jelszót is meg kell adni a módosításhoz.');
      }

      const isMatch = await bcrypt.compare(updateData.currentPassword, provider.password);
      if (!isMatch) {
        throw new BadRequestException('A megadott jelszó nem egyezik a jelenlegi jelszóval.');
      }

      provider.password = await bcrypt.hash(updateData.newPassword, 10);
    }

    // város (city) válrotatás esetén latitude & longitude értékek frissítése
    if (updateData.city && updateData.city !== provider.city) {
      const { lat, lng } = await this.getCoordinatesFromCity(updateData.city);
      provider.lat = lat;
      provider.lng = lng;
    }

    // szakterület id(k) validálása
    if (updateData.specs !== undefined) {
      if (!Array.isArray(updateData.specs)) {
        throw new BadRequestException('A szakterületek listája kötelező és tömb típusú kell legyen.');
      }

      const validSpecs = await this.lawyerTypeRepo.findBy({ id: In(updateData.specs) });

      if (validSpecs.length !== updateData.specs.length) {
        throw new BadRequestException('Nem létező szakterület azonosító.');
      }

      provider.specs = JSON.stringify(updateData.specs);
    }


    // módosított adatok mentése
    Object.assign(provider, {
      ...updateData,
      specs: JSON.stringify(updateData.specs),
    })
    await this.providerRepo.save(provider);
    return { message: 'A profil frissítve.' };
  }

  // getLawyerTypes
  async getLawyerTypes() {
    return this.lawyerTypeRepo.find();
  }
}