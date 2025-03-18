import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProvider } from '../auth/entities/userProvider.entity';

@Injectable()
export class LawyerSearchService {
  constructor(
    @InjectRepository(UserProvider)
    private readonly providerRepo: Repository<UserProvider>,
  ) {}

    async searchLawyers(
        specialtyId: number,
        location: { lat?: number; lng?: number; county?: string; city?: string }
      ): Promise<UserProvider[]> {
        const baseQuery = this.providerRepo.createQueryBuilder('provider')
          .where('JSON_CONTAINS(provider.specs, :spec)', {
            spec: JSON.stringify([specialtyId]),
          });
      
        // Közelemben keresés (30 km-en belül)
        if (location.lat && location.lng) {
          baseQuery
            .addSelect(`
              ST_Distance_Sphere(
                POINT(provider.lng, provider.lat),
                POINT(:lng, :lat)
              ) AS distance
            `)
            .setParameters({ lat: location.lat, lng: location.lng })
            .having('distance <= 30000')
            .orderBy('distance', 'ASC');
        }
      
        // Megye és (opcionálisan) város alapú keresés
        else if (location.county) {
          baseQuery.andWhere('LOWER(provider.county) = LOWER(:county)', {
            county: location.county,
          });
      
          if (location.city) {
            baseQuery.addSelect(`
              IF(LOWER(provider.city) = LOWER(:city), 0, 1) AS isSameCity
            `)
            .setParameter('city', location.city)
            .orderBy('isSameCity', 'ASC');
          }
        }
      
        // Város alapú keresés (ha nincs county)
        else if (location.city) {
          baseQuery.andWhere('LOWER(provider.city) = LOWER(:city)', {
            city: location.city,
          });
        }
      
        return baseQuery.getMany();
      }      
}
