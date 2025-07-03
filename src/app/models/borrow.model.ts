import { model, Schema } from "mongoose";
import { IBorrow } from "../interfaces/borrow.interface";

const borrowSchema = new Schema<IBorrow>({
    book: { type: Schema.Types.ObjectId, ref: 'books', required: [true, 'Book is required'] },
    quantity: { 
        type: Number, 
        required: true, 
        default: 1, 
        min: [1, 'Quantity must be at least 1']
    },
    dueDate: { type: Date, required: [true, 'Due date is required'] }
},
{
    versionKey: false,
    timestamps: true
});



export const Borrow = model<IBorrow>("Borrow", borrowSchema);