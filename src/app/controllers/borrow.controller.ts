import express, { Request, Response } from "express";
import { Book } from "../models/books.model";
import { Borrow } from "../models/borrow.model";


export const borrowRoutes = express.Router();

borrowRoutes.post('/', async (req: Request, res:Response) : Promise<any> => {
    try {
        const { book, quantity, dueDate } = req.body;
        const myBook = await Book.findById(book)

        if(!myBook) {
            return res.status(404).json({
                message: "Book not found",
                success: false,
                error: "Book not found"
            });

        }

        const hasCopies = (myBook as any).hascopies(quantity);
        myBook.available = hasCopies;
        if (!hasCopies) {
            return res.status(400).json({
                message: "Not enough copies available",
                success: false,
                error: "Not enough copies available"
            });
        }
        

        if (!dueDate || new Date(dueDate) < new Date()) {
            return res.status(400).json({
                message: "Invalid due date",
                success: false,
                error: "Due date must be a future date"
            });
        }

        myBook.copies -= quantity;

        await myBook.save();

        const body = req.body;
        const borrowRecord = await Borrow.create(body)
        
        
        res.status(200).json({
            success: true,
            message: "Book borrowed successfully",
            data: borrowRecord
        })
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            success: false,
            error: error
        });
    }
});

borrowRoutes.get('/', async (req: Request, res: Response) : Promise<any> => {
    try {
        const borrowedSummary = await Borrow.aggregate([
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

    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            success: false,
            error: error
        });
    }
});
