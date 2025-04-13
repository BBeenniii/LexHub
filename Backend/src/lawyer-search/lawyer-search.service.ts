import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProvider } from '../auth/entities/userProvider.entity';
import { LawyerSearchDto } from './dto/lawyer-search.dto';
import { LocationValidatorService } from '../location-validator/location-validator.service';

@Injectable()
export class LawyerSearchService {
  constructor(
    @InjectRepository(UserProvider)
    private readonly providerRepo: Repository<UserProvider>,
    private readonly locationValidator: LocationValidatorService
  ) {}
    async searchLawyers(dto: LawyerSearchDto) {
      const qb = this.providerRepo.createQueryBuilder('provider');
      console.log("🎯 DTO érkezett:", dto);
      
      if (dto.specialtyId) {
        qb.andWhere('provider.specs LIKE :specMatch', {
          specMatch: `[%${dto.specialtyId}%]`,
        });
      }
    
      if (dto.lat && dto.lng) {
        console.log("📍 Lokációs (lat/lng) keresés");
        qb.addSelect(`
            ST_Distance_Sphere(
              POINT(provider.lng, provider.lat),
              POINT(:lng, :lat)
            ) AS distance`)
          .setParameters({ lat: dto.lat, lng: dto.lng })
          .having('distance <= 30000') // max 30 km
          .orderBy('distance', 'ASC');
      } else if (dto.county) {
        await this.locationValidator.validateCounty(dto.county);
        qb.andWhere('provider.county = :county', { county: dto.county });
      } else if (dto.city) {
        await this.locationValidator.validateCity(dto.city);
        qb.andWhere('provider.city = :city', { city: dto.city });
      }
    
      console.log("Generált SQL:", qb.getSql());
      return qb.getMany();
    }    


}