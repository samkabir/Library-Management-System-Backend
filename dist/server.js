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
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let server;
const PORT = process.env.PORT || 5000;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!process.env.MONGODB_USERNAME || !process.env.MONGODB_PASSWORD) {
                throw new Error("MONGODB_USERNAME or MONGODB_PASSWORD environment variable is not set.");
            }
            yield mongoose_1.default.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.xz4eovr.mongodb.net/libraryManagementSystem?retryWrites=true&w=majority&appName=Cluster0`);
            console.log("Connected to MongoDB using Mongoose");
            server = app_1.default.listen(PORT, () => {
                console.log(`App is listening on port ${PORT}`);
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
main();
