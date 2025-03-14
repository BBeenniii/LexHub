import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSeeker } from './entities/userSeeker.entity';
import { UserProvider } from './entities/userProvider.entity';
import { LawyerType } from './entities/lawyerType.entity';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
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
    if (existingUser) {
      throw new Error('Ez az email már regisztrálva van egy felhasználónál!');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = this.seekerRepo.create({ ...data, password: hashedPassword });
    await this.seekerRepo.save(user);
    return { message: 'Felhasználó sikeresen regisztrálva' };
  }

  async registerProvider(data: any): Promise<any> {
    const existingUser = await this.providerRepo.findOne({ where: { email: data.email } });
    if (existingUser) {
      throw new Error('Ez az email már regisztrálva van!');
    }

    const existingKASZ = await this.providerRepo.findOne({ where: { kasz: data.kasz } });
    if (existingKASZ) {
      throw new Error('Ez a KASZ szám már regisztrálva van!');
    }

    const validSpecs = await this.lawyerTypeRepo.findByIds(data.specs);
    if (validSpecs.length !== data.specs.length) {
      throw new Error('Egy vagy több kiválasztott szakterület nem létezik az adatbázisban.');
    }

    // Geocoding
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

}
