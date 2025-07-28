import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL as string;

const DBConnection = async () =>{
    try {
        console.log(MONGODB_URL);
        const connection = await mongoose.connect(MONGODB_URL);
        return `Successfully connected to ${connection.connection?.host}`;
    } catch (error) {
        return "MongoDB connection Error: " + error;
    }
}

export default DBConnection;