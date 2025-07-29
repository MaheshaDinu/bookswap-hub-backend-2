import conditions from "../enums/conditions.enum";
export interface BookDto{
    id: number;
    title: string;
    author: string;
    category: string;
    description: string;
    condition: conditions;
    ownerId: number;
    imageUrl: string;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
}