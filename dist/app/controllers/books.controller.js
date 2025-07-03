"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.booksRoutes = void 0;
const express_1 = __importDefault(require("express"));
const books_model_1 = require("../models/books.model");
exports.booksRoutes = express_1.default.Router();
exports.booksRoutes.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const myBook = yield books_model_1.Book.create(body);
        res.status(200).json({
            success: true,
            message: "Book created successfully",
            data: myBook
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            success: false,
            error: error
        });
    }
}));
exports.booksRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter, sortBy = "createdAt", sort = "asc", limit = "10" } = req.query;
        const matchStage = {};
        if (filter) {
            const allowedFilterTypes = ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'];
            if (!allowedFilterTypes.includes(filter)) {
                return res.status(400).json({
                    message: `Invalid Filter value. Use one of: ${allowedFilterTypes.join(", ")}.`,
                    success: false,
                    error: `Invalid filter value: ${filter}`
                });
            }
            matchStage.genre = filter;
        }
        if (sort && !["asc", "desc"].includes(sort)) {
            return res.status(400).json({
                message: "Invalid sort value. Use 'asc' or 'desc'.",
                success: false,
                error: `Invalid sort value: ${sort}`
            });
        }
        const allowedSortByFields = ["_id", "title", "author", "genre", "description", "copies", "isbn", "createdAt", "updatedAt", "available"];
        if (!allowedSortByFields.includes(sortBy)) {
            return res.status(400).json({
                message: `Invalid sortBy value. Use one of: ${allowedSortByFields.join(", ")}.`,
                success: false,
                error: `Invalid sortBy value: ${sortBy}`
            });
        }
        const sortStage = {
            [sortBy]: sort === "desc" ? -1 : 1
        };
        const limitNumber = parseInt(limit, 10);
        const books = yield books_model_1.Book.aggregate([
            { $match: matchStage },
            { $sort: sortStage },
            { $limit: limitNumber }
        ]);
        if (!books.length) {
            return res.status(404).json({
                message: "No books found",
                success: false,
                error: books
            });
        }
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data: books
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            success: false,
            error
        });
    }
}));
exports.booksRoutes.get('/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const book = yield books_model_1.Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                message: "Book not found",
                success: false,
                error: book
            });
        }
        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            data: book
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            success: false,
            error: error
        });
    }
}));
exports.booksRoutes.put('/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const updatedBody = req.body;
        if (updatedBody._id) {
            return res.status(400).json({
                message: "Cannot update _id field",
                success: false,
                error: "Cannot update _id field"
            });
        }
        const book = yield books_model_1.Book.findByIdAndUpdate(bookId, updatedBody, { new: true, runValidators: true });
        if (!book) {
            return res.status(404).json({
                message: "Book not found",
                success: false,
                error: updatedBody
            });
        }
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: book
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            success: false,
            error: error
        });
    }
}));
exports.booksRoutes.delete('/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const book = yield books_model_1.Book.findByIdAndDelete(bookId);
        if (!book) {
            return res.status(404).json({
                message: "Book not found",
                success: false,
                error: book
            });
        }
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: null
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            success: false,
            error: error
        });
    }
}));
