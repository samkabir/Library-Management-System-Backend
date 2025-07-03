import { Types } from "mongoose"


export interface IBook {
    _id?: Types.ObjectId,
    title: string,
    author: string,
    genre: string,
    isbn: string,
    description?: string,
    copies: number,
    available: boolean,
    createdAt?: Date,
    updatedAt?: Date
}

export interface BookAvaiabilityMethod {
    hascopies(copies: number): boolean;
}