export interface User{
    id: number;
    name: string;
    email: string;
    password: string;
    location: string;
    contact: string;
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date
}