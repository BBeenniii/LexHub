export interface UserData {
  id: number;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  county?: string;
  city?: string;
  userType: 'seeker' | 'provider';
  specs?: number[];
  specNames?: string[];
}

export interface LawyerType {
  id: number;
  type: string;
}
