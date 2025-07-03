"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = require("mongoose");
const bookSchema = new mongoose_1.Schema({
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
}, {
    versionKey: false,
    timestamps: true
});
bookSchema.pre('save', function (next) {
    if (this.copies === 0) {
        this.available = false;
    }
    else {
        this.available = true;
    }
    next();
});
bookSchema.method("hascopies", function (copies) {
    return this.copies >= copies;
});
exports.Book = (0, mongoose_1.model)("Book", bookSchema);
