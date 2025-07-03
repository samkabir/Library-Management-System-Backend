
import { Server } from 'http';
import app from './app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); 

let server: Server;

const PORT = process.env.PORT || 5000;

async function main(){
    try {
        if (!process.env.MONGODB_USERNAME || !process.env.MONGODB_PASSWORD) {
            throw new Error("MONGODB_USERNAME or MONGODB_PASSWORD environment variable is not set.");
        }
        await mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.xz4eovr.mongodb.net/libraryManagementSystem?retryWrites=true&w=majority&appName=Cluster0`);
        console.log("Connected to MongoDB using Mongoose");
        server = app.listen(PORT, () => {
            console.log(`App is listening on port ${PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}

main();