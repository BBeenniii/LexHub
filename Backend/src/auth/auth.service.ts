import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSeeker } from './entities/userSeeker.entity';
import { UserProvider } from './entities/userProvider.entity';
import { LawyerType } from './entities/lawyerType.entity';
import * as bcrypt from 'bcrypt';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserSeeker)
    private seekerRepo: Repository<UserSeeker>,

    @InjectRepository(UserProvider)
    private providerRepo: Repository<UserProvider>,

    @InjectRepository(LawyerType)
    private lawyerTypeRepo: Repository<LawyerType>,

    private configService: ConfigService,
  ) {}

  async registerSeeker(data: any): Promise<any> {
    const existingUser = await this.seekerRepo.findOne({ where: { email: data.email } });
    if (existingUser) throw new Error('Ez az email már regisztrálva van!');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = this.seekerRepo.create({ ...data, password: hashedPassword });
    await this.seekerRepo.save(user);
    return { message: 'Felhasználó sikeresen regisztrálva' };
  }

  async registerProvider(data: any): Promise<any> {
    const existingUser = await this.providerRepo.findOne({ where: { email: data.email } });
    if (existingUser) throw new Error('Ez az email már regisztrálva van!');

    const existingKASZ = await this.providerRepo.findOne({ where: { kasz: data.kasz } });
    if (existingKASZ) throw new Error('Ez a KASZ szám már regisztrálva van!');

    const validSpecs = await this.lawyerTypeRepo.findByIds(data.specs);
    if (validSpecs.length !== data.specs.length) throw new Error('Nem létező szakterület.');

    const apiKey = this.configService.get('OPENCAGE_API_KEY');
    const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${data.city},${data.country}&key=${apiKey}`;

    let lat = null;
    let lng = null;

    try {
      const geoRes = await axios.get(geocodeUrl);
      const geoData = geoRes.data;
      if (geoData.results && geoData.results.length > 0) {
        lat = geoData.results[0].geometry.lat;
        lng = geoData.results[0].geometry.lng;
      }
    } catch (error) {
      console.error('Geocoding hiba:', error);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = this.providerRepo.create({
      ...data,
      password: hashedPassword,
      specs: JSON.stringify(data.specs),
      lat,
      lng,
    });

    await this.providerRepo.save(user);
    return { message: 'Szolgáltató sikeresen regisztrálva' };
  }

  async getLawyerTypes(): Promise<LawyerType[]> {
    return this.lawyerTypeRepo.find();
  }

  async login(data: { userType: 'seeker' | 'provider'; email: string; password: string }) {
    const { userType, email, password } = data;

    if (userType === 'seeker') {
      const user = await this.seekerRepo.findOne({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Hibás e-mail vagy jelszó');
      }
      return { message: 'Sikeres bejelentkezés', user };
    }

    if (userType === 'provider') {
      const user = await this.providerRepo.findOne({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Hibás e-mail vagy jelszó');
      }
      return { message: 'Sikeres bejelentkezés', user };
    }

    throw new UnauthorizedException('Ismeretlen felhasználótípus');
  }

  async getProfile(id: number) {
    const seeker = await this.seekerRepo.findOne({ where: { id } });
    if (seeker) {
      return {
        id: seeker.id,
        name: seeker.name,
        email: seeker.email,
        phone: seeker.phone || '',
        country: seeker.country || '',
        county: seeker.county || '',
        city: seeker.city || '',
        userType: 'seeker',
      };
    }

    const provider = await this.providerRepo.findOne({ where: { id } });
    if (provider) {
      const specIds: number[] = JSON.parse(provider.specs || '[]');
      const specEntities = await this.lawyerTypeRepo.findByIds(specIds);

      return {
        id: provider.id,
        name: provider.name,
        email: provider.email,
        phone: provider.phone || '',
        country: provider.country || '',
        county: provider.county || '',
        city: provider.city || '',
        userType: 'provider',
        specs: specIds,
        specNames: specEntities.map((spec) => spec.type),
      };
    }

    throw new Error('Felhasználó nem található.');
  }

  async updateProfile(id: number, updateData: { name: string; email: string; phone?: string; country?: string; county?: string; city?: string; specs?: number[] }) {
    const seeker = await this.seekerRepo.findOne({ where: { id } });
    if (seeker) {
      seeker.name = updateData.name;
      seeker.email = updateData.email;
      seeker.phone = updateData.phone || '';
      seeker.country = updateData.country || '';
      seeker.county = updateData.county || '';
      seeker.city = updateData.city || '';
      await this.seekerRepo.save(seeker);
      return { message: 'Seeker profil frissítve.' };
    }

    const provider = await this.providerRepo.findOne({ where: { id } });
    if (provider) {
      provider.name = updateData.name;
      provider.email = updateData.email;
      provider.phone = updateData.phone || '';
      provider.country = updateData.country || '';
      provider.county = updateData.county || '';
      provider.city = updateData.city || '';

      if (updateData.specs) {
        provider.specs = JSON.stringify(updateData.specs);
      }

      await this.providerRepo.save(provider);
      return { message: 'Provider profil frissítve.' };
    }

    throw new Error('Felhasználó nem található.');
  }
}
