export type User = {
    id: number;
    name: string;
    email: string;
    userType: 'seeker' | 'provider';
    phone?: string;
    country?: string;
    county?: string;
    city?: string;
};  