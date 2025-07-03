import { Model, model, Schema } from "mongoose";
import { BookAvaiabilityMethod, IBook } from "../interfaces/books.interface";

const bookSchema = new Schema<IBook, Model<IBook>, BookAvaiabilityMethod>({
    title: { type: String, required: [true, 'Title is required'] },
    author: { type: String, required: [true, 'Author is required'] },
    genre: { 
        type: String, 
        required: [true, 'Genre is required'],
        enum: {
            values: ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'],
            message: 'Genre must be one of FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY'
        }
    },
    isbn: { type: String, required: [true, 'ISBN is required'], unique: true },
    description: { type: String },
    copies: { 
        type: Number, 
        required: [true, 'Copies is required'], 
        default: 1, 
        min: [0, 'Copies cannot be negative']
    },
    available: { type: Boolean, default: true },
},
{
    versionKey: false,
    timestamps: true
});


bookSchema.pre('save', function (next) {
    if (this.copies === 0) {
        this.available = false;
    } else {
        this.available = true;
    }
    next();
});

bookSchema.method("hascopies", function (copies: number): boolean {
     return this.copies >= copies;
});



export const Book = model<IBook>("Book", bookSchema);