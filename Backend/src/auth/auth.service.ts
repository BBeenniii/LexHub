import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async registerSeeker(dto: RegisterSeekerDto) {
    const existingEmail = await this.seekerRepo.findOne({ where: { email: dto.email } });
    if (existingEmail) {
      throw new BadRequestException('Ez az email már regisztrálva van!');
    }

     // NEW: city & county validáció
    if (dto.city || dto.county) {
      console.log("Validating city and county:", dto.city, dto.county);
      await this.locationValidator.validateCityAndCounty(
        dto.city ?? '',
        dto.county ?? ''
      );
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const seeker = this.seekerRepo.create({ ...dto, password: hashedPassword });
    await this.seekerRepo.save(seeker);
    return { message: 'Sikeres regisztráció' };
  }

  async registerProvider(dto: RegisterProviderDto) {
    const emailTaken =
      (await this.providerRepo.findOne({ where: { email: dto.email } })) ||
      (await this.seekerRepo.findOne({ where: { email: dto.email } }));
    if (emailTaken) throw new BadRequestException('Ez az email már regisztrálva van!');

    const existingKASZ = await this.providerRepo.findOne({ where: { kasz: dto.kasz } });
    if (existingKASZ) throw new BadRequestException('Ez a KASZ szám már használatban van!');

    const validSpecs = await this.lawyerTypeRepo.findByIds(dto.specs);
    if (validSpecs.length !== dto.specs.length) throw new BadRequestException('Nem létező szakterület!');

    // OpenCage API - szélesség hosszúsághoz
    const geoUrl = `https://api.opencagedata.com/geocode/v1/json?q=${dto.city},${dto.country}&key=${this.configService.get('OPENCAGE_API_KEY')}`;
    let lat = null, lng = null;
    try {
      const geoRes = await axios.get(geoUrl);
      if (geoRes.data?.results?.length > 0) {
        lat = geoRes.data.results[0].geometry.lat;
        lng = geoRes.data.results[0].geometry.lng;
      }
    } catch (err) {
      console.warn('[WARNING]: Geocoding sikertelen:', err);
    }

    // NEW: city & county validáció
    if (dto.city || dto.county) {
      console.log("Validating city and county:", dto.city, dto.county);
      await this.locationValidator.validateCityAndCounty(
        dto.city ?? '',
        dto.county ?? ''
      );
    }
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

  async login({ email, password }: LoginDto) { // Automatikusan meghatározza a usertypeot már
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

  async getProfile(id: number) {
    const seeker = await this.seekerRepo.findOne({ where: { id } });
    if (seeker) {
      return { ...seeker, userType: 'seeker' };
    }

    const provider = await this.providerRepo.findOne({ where: { id } });
    if (provider) {
      const specIds = JSON.parse(provider.specs || '[]');
      const specEntities = await this.lawyerTypeRepo.findByIds(specIds);
      return {
        ...provider,
        specs: specIds,
        specNames: specEntities.map((s) => s.type),
        userType: 'provider',
      };
    }

    throw new BadRequestException('Felhasználó nem található');
  }

  async updateProfile(id: number, updateData: UpdateSeekerDto | UpdateProviderDto) {
    const checkEmail = async (email: string, currentId: number) => {
      const seeker = await this.seekerRepo.findOne({ where: { email } });
      if (seeker && seeker.id !== currentId) throw new BadRequestException('Ez az email cím már használatban van!');

      const provider = await this.providerRepo.findOne({ where: { email } });
      if (provider && provider.id !== currentId) throw new BadRequestException('Ez az email cím már használatban van!');
    };

    await checkEmail(updateData.email ?? '', id);

    // NEW: city & county validáció
    if (updateData.city || updateData.county) {
      console.log("Validating city and county:", updateData.city, updateData.county);
      await this.locationValidator.validateCityAndCounty(
        updateData.city ?? '',
        updateData.county ?? ''
      );
    }

    const seeker = await this.seekerRepo.findOne({ where: { id } });
    if (seeker) {
      Object.assign(seeker, updateData);
      await this.seekerRepo.save(seeker);
      console.log("[LOG]: SEEKER profile updated")
      return { message: 'A profil frissítve.' };
    }

    const provider = await this.providerRepo.findOne({ where: { id } });
    if (provider) {
      Object.assign(provider, {
        ...updateData,
        specs: 'specs' in updateData ? JSON.stringify(updateData.specs) : provider.specs,
      });
      await this.providerRepo.save(provider);
      console.log("[LOG]: PROVIDER profile updated")
      return { message: 'A profil frissítve.' };
    }

    throw new BadRequestException('Felhasználó nem található.');
  }

  async getLawyerTypes() {
    return this.lawyerTypeRepo.find();
  }
}