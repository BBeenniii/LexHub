import { BadRequestException, Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class LocationValidatorService {
  private readonly API_KEY = process.env.OPENCAGE_API_KEY;
  private normalizeMatch(a: string, b: string): boolean {
    return a.trim().toLowerCase() === b.trim().toLowerCase();
  }

  async validateCityAndCounty(city?: string, county?: string): Promise<void> {
    if (city) await this.validateCity(city);
    if (county) await this.validateCounty(county);
  }  

  async validateCity(city: string): Promise<void> {
    const res = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
      params: {
        key: this.API_KEY,
        q: `${city}, Hungary`,
        countrycode: 'hu',
        limit: 1,
      }
    });
  
    const result = res.data.results?.[0];
    const components = result?.components;
  
    const validCity =
      components?.city ||
      components?.town ||
      components?.village ||
      components?.hamlet ||
      components?.municipality;
  
    if (!validCity) {
      throw new BadRequestException(`A megadott város nem ismerhető fel: "${city}"`);
    }
  
    if (!this.normalizeMatch(city, validCity)) {
      throw new BadRequestException(`A megadott város nem található: "${city}"`);
    }
  }
  
  async validateCounty(county: string): Promise<void> {
    const res = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
      params: {
        key: this.API_KEY,
        q: `${county}, Hungary`,
        countrycode: 'hu',
        limit: 1,
      }
    });
  
    const result = res.data.results?.[0];
    const components = result?.components;
  
    const validCounty =
      components?.county ||
      components?.state ||
      components?.region;
  
    if (!validCounty) {
      throw new BadRequestException(`A megadott megye nem ismerhető fel: "${county}"`);
    }
  
    if (!this.normalizeMatch(county, validCounty)) {
      throw new BadRequestException(`A megadott megye nem található: "${county}"`);
    }
  }  


  /*
  async validateCityAndCounty(city?: string, county?: string): Promise<void> {
    if (!city && !county) return;
  
    const query = [city, county, "Hungary"].filter(Boolean).join(", ");
  
    const res = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
      params: {
        key: this.API_KEY,
        q: query,
        countrycode: 'hu',
        limit: 1,
      }
    });
  
    const result = res.data.results?.[0];
    if (!result) throw new BadRequestException("Nem létező város vagy megye.");
  
    const components = result.components;
  
    const validCity =
      components.city ||
      components.town ||
      components.village ||
      components.hamlet ||
      components.municipality;
  
    const validCounty =
      components.county ||
      components.state ||
      components.region;
  
      // logok 
      console.log('✅ city:', city);
      console.log('✅ county:', county);
      console.log('🔍 validCity:', validCity);
      console.log('🔍 validCounty:', validCounty);
      console.log('📦 OpenCage components:', components);
      


    // Először azt nézzük, hogy hiányzik-e valamelyik
    if (city && !validCity && !validCounty) {
        throw new BadRequestException(`A megadott város és megye nem ismerhető fel: "${city}", "${county}"`);
      }
      
      if (city && !validCity) {
        throw new BadRequestException(`A megadott város nem ismerhető fel: "${city}"`);
      }
      
      if (county && !validCounty) {
        throw new BadRequestException(`A megadott megye nem ismerhető fel: "${county}"`);
      }
      
      if (city && validCity && !this.normalizeMatch(city, validCity)) {
        throw new BadRequestException(`A megadott város nem található: "${city}"`);
      }
      
      if (county && validCounty && !this.normalizeMatch(county, validCounty)) {
        throw new BadRequestException(`A megadott megye nem található: "${county}"`);
      }
        
  }  

  private normalizeMatch(a: string, b: string): boolean {
    return a.trim().toLowerCase() === b.trim().toLowerCase();
  }*/
}