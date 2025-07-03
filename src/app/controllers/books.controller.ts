import express, { Request, Response } from "express";
import { Book } from "../models/books.model";


export const booksRoutes = express.Router();


booksRoutes.post('/', async (req: Request, res:Response) : Promise<any> => {
    try {
        const body = req.body;

        const myBook = await Book.create(body);
        
        res.status(200).json({
            success: true,
            message: "Book created successfully",
            data: myBook
        })
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            success: false,
            error: error
        });
    }
});

booksRoutes.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const { filter, sortBy = "createdAt", sort = "asc", limit = "10" } = req.query;

    const matchStage: any = {};
    if (filter) {
        const allowedFilterTypes = ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'] as const;

        type SortField = typeof allowedFilterTypes[number];

        if (!allowedFilterTypes.includes(filter as SortField)) {
            return res.status(400).json({
                message: `Invalid Filter value. Use one of: ${allowedFilterTypes.join(", ")}.`,
                success: false,
                error: `Invalid filter value: ${filter}`
            });
        }
        matchStage.genre = filter;
    }



    if (sort && !["asc", "desc"].includes(sort as string)) {
      return res.status(400).json({
        message: "Invalid sort value. Use 'asc' or 'desc'.",
        success: false,
        error: `Invalid sort value: ${sort}`
      });
    }

    const allowedSortByFields = [ "_id", "title", "author", "genre", "description", "copies", "isbn", "createdAt", "updatedAt", "available" ] as const;

    type SortField = typeof allowedSortByFields[number];

    if (!allowedSortByFields.includes(sortBy as SortField)) {
        return res.status(400).json({
            message: `Invalid sortBy value. Use one of: ${allowedSortByFields.join(", ")}.`,
            success: false,
            error: `Invalid sortBy value: ${sortBy}`
        });
    }

    const sortStage: any = {
      [sortBy as string]: sort === "desc" ? -1 : 1
    };

    const limitNumber = parseInt(limit as string, 10);

    const books = await Book.aggregate([
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
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      success: false,
      error
    });
  }
});

booksRoutes.get('/:bookId', async (req: Request, res:Response) : Promise<any> => {
     try {
        const bookId = req.params.bookId;
        const book = await Book.findById(bookId)

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
        })

        
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            success: false,
            error: error
        });
    }

});

booksRoutes.put('/:bookId', async (req: Request, res:Response) : Promise<any>=>{
    try {
        const bookId = req.params.bookId;
        const updatedBody = req.body;

        if(updatedBody._id) {
            return res.status(400).json({
                message: "Cannot update _id field",
                success: false,
                error: "Cannot update _id field"
            });
        }
        
        const book = await Book.findByIdAndUpdate(bookId, updatedBody, { new : true, runValidators: true })

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
        })
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            success: false,
            error: error
        });
    }

});

booksRoutes.delete('/:bookId', async (req: Request, res:Response ) : Promise<any> =>{
    try {
        const bookId = req.params.bookId;
        const book = await Book.findByIdAndDelete(bookId);
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
        })
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            success: false,
            error: error
        });
    }
});
