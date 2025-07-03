
import { Server } from 'http';
import app from './app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); 

let server: Server;

const PORT = process.env.PORT || 5000;

async function main(){
    try {
        await mongoose.connect(`${process.env.DATABASE_URL}`);
        console.log("Connected to MongoDB using Mongoose");
        server = app.listen(PORT, () => {
            console.log(`App is listening on port ${PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}

main();