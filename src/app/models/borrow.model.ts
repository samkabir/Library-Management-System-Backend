import { model, Schema } from "mongoose";
import { IBorrow } from "../interfaces/borrow.interface";
import { Book } from "./books.model";

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


borrowSchema.post('save', async function(doc) {
    const book = await Book.findById(doc.book);
    
    if (book) {
        book.available = book.copies > 0;
        await book.save();
    }
});


export const Borrow = model<IBorrow>("Borrow", borrowSchema);