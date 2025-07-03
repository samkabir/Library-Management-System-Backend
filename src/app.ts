import express, { Application, Request, Response } from 'express';
import { booksRoutes } from './app/controllers/books.controller';
import { borrowRoutes } from './app/controllers/borrow.controller';

const app: Application = express();

app.use(express.json())

app.use("/api/books", booksRoutes);
app.use("/api/borrow", borrowRoutes);


app.get('/', (req: Request, res:Response)=>{
    res.send('Welcome to Library Management System App');
});

app.use((req: Request, res: Response) => {
    res.status(404).json({
        message: "Route not found",
        success: false,
        error: "Not Found"
    });
});

export default app;