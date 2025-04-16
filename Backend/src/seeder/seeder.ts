import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { UserSeeker } from '../auth/entities/userSeeker.entity';
import { UserProvider } from '../auth/entities/userProvider.entity';
import { LawyerType } from '../auth/entities/lawyerType.entity';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  const seekerRepo = dataSource.getRepository(UserSeeker);
  const providerRepo = dataSource.getRepository(UserProvider);
  const lawyerTypeRepo = dataSource.getRepository(LawyerType);

  const hashedPassword = await bcrypt.hash('Teszt1234!', 10);
  const allSpecs = await lawyerTypeRepo.find();

  const counties = [
    'Budapest', 'Baranya', 'Bács-Kiskun', 'Békés', 'Borsod-Abaúj-Zemplén',
    'Csongrád-Csanád', 'Fejér', 'Győr-Moson-Sopron', 'Hajdú-Bihar', 'Heves',
    'Jász-Nagykun-Szolnok', 'Komárom-Esztergom', 'Nógrád', 'Pest', 'Somogy',
    'Szabolcs-Szatmár-Bereg', 'Tolna', 'Vas', 'Veszprém', 'Zala'
  ];

  const cities = [
    'Budapest', 'Pécs', 'Szeged', 'Miskolc', 'Debrecen', 'Székesfehérvár',
    'Győr', 'Nyíregyháza', 'Kecskemét', 'Eger', 'Zalaegerszeg', 'Szolnok',
    'Tatabánya', 'Sopron', 'Kaposvár', 'Szombathely', 'Veszprém', 'Békéscsaba'
  ];

  // 5 Seeker
  for (let i = 1; i <= 10; i++) {
    const seeker = seekerRepo.create({
      name: `Teszt Seeker ${i}`,
      email: `seeker${i}@test.hu`,
      password: hashedPassword,
      phone: `06-30-000-000${i}`,
      country: 'Hungary',
      county: counties[Math.floor(Math.random() * counties.length)],
      city: cities[Math.floor(Math.random() * cities.length)],
    });
    await seekerRepo.save(seeker);
  }

  // 20 Provider
  for (let i = 1; i <= 20; i++) {
    const randomSpecs = [...allSpecs]
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 2) + 1) // 1-5 random spec
      .map(s => s.id);

    const provider = providerRepo.create({
      name: `Teszt Ügyvéd ${i}`,
      email: `provider${i}@test.hu`,
      password: hashedPassword,
      phone: `06-20-${Math.floor(Math.random() * 9000000 + 1000000)}`,
      country: 'Hungary',
      county: counties[Math.floor(Math.random() * counties.length)],
      city: cities[Math.floor(Math.random() * cities.length)],
      kasz: `KASZ-${i}`,
      lat: 47.4979,
      lng: 19.0402,
      specs: JSON.stringify(randomSpecs),
      providerType: 'individual',
    });
    await providerRepo.save(provider);
  }

  console.log('Seeder sikeresen lefutott '); // futtatás: npx ts-node src/seeder/seeder.ts
  await app.close();
}

bootstrap();