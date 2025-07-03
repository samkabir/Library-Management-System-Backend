import { Types } from "mongoose";

export interface IBorrow {
    id?: Types.ObjectId,
    book: Types.ObjectId,
    quantity: number,
    dueDate: Date,
    createdAt?: Date,
    updatedAt?: Date
}
