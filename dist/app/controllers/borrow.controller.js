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
exports.borrowRoutes = void 0;
const express_1 = __importDefault(require("express"));
const books_model_1 = require("../models/books.model");
const borrow_model_1 = require("../models/borrow.model");
exports.borrowRoutes = express_1.default.Router();
exports.borrowRoutes.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { book, quantity, dueDate } = req.body;
        const myBook = yield books_model_1.Book.findById(book);
        if (!myBook) {
            return res.status(404).json({
                message: "Book not found",
                success: false,
                error: "Book not found"
            });
        }
        if (!dueDate || new Date(dueDate) < new Date()) {
            return res.status(400).json({
                message: "Invalid due date",
                success: false,
                error: "Due date must be a future date"
            });
        }
        const hasCopies = myBook.hascopies(quantity);
        myBook.available = hasCopies;
        if (!hasCopies) {
            return res.status(400).json({
                message: "Not enough copies available",
                success: false,
                error: "Not enough copies available"
            });
        }
        myBook.copies -= quantity;
        yield myBook.save();
        const body = req.body;
        const borrowRecord = yield borrow_model_1.Borrow.create(body);
        res.status(200).json({
            success: true,
            message: "Book borrowed successfully",
            data: borrowRecord
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
exports.borrowRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const borrowedSummary = yield borrow_model_1.Borrow.aggregate([
            {
                $lookup: {
                    from: "books",
                    localField: "book",
                    foreignField: "_id",
                    as: "bookDetails"
                }
            },
            {
                $group: {
                    _id: "$book",
                    totalQuantity: { $sum: "$quantity" },
                    bookDetails: { $first: "$bookDetails" }
                }
            },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: { $arrayElemAt: ["$bookDetails.title", 0] },
                        isbn: { $arrayElemAt: ["$bookDetails.isbn", 0] }
                    },
                    totalQuantity: 1
                }
            }
        ]);
        res.status(200).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: borrowedSummary
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
