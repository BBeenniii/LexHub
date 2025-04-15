import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProvider } from '../auth/entities/userProvider.entity';
import { LawyerSearchDto } from './dto/lawyer-search.dto';
import { LocationValidatorService } from '../location-validator/location-validator.service';
import { LawyerType } from 'src/auth/entities/lawyerType.entity';

@Injectable()
export class LawyerSearchService {
  constructor(
    @InjectRepository(UserProvider)
    private readonly providerRepo: Repository<UserProvider>,
    @InjectRepository(LawyerType)
    private readonly lawyerTypeRepo: Repository<LawyerType>,
    private readonly locationValidator: LocationValidatorService
  ) {}
    async searchLawyers(dto: LawyerSearchDto) {
      // Bár maga az alkalmazás nem használja, de tesztek után kiegészített védelem bad requestekre
      const type = await this.lawyerTypeRepo.findOne({ where: { id: dto.specialtyId } });
      if (!type) {
        throw new BadRequestException(`A megadott szakterület nem létezik (ID: ${dto.specialtyId})`);
      }

      if ((dto.city && dto.county) || (dto.city && dto.lat && dto.lng) || (dto.county && dto.lat && dto.lng)) {
        throw new BadRequestException("Egyszerre csak egy helyi szűrő (city, county vagy lat/lng) adható meg!");
      }
      
      if (!dto.city && !dto.county && !(dto.lat && dto.lng)) {
        throw new BadRequestException("Legalább egy helyi szűrőt (city, county vagy lat/lng) meg kell adni!");
      }
      
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