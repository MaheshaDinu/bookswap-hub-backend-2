import mongoose from "mongoose";
import conditionsEnum from "../enums/conditions.enum";



const BookModel = new mongoose.Schema(
    {
        "id":{
            required: true,
            type: Number,
            unique: true,
            index: true,
        },
        "title": {
            required: true,
            type: String,
        },
        "author": {
            required: true,
            type: String,
        },
        "category": {
            required: true,
            type: String,
        },
        "description": {
            required: true,
            type: String,
        },
        "condition": {
            required: true,
            type: String,
            enum: conditionsEnum
        },
        "ownerId": {
            required: true,
            type: Number,
        },
        "imageUrl": {
            required: true,
            type: String,
        },
        "isAvailable": {
            required: true,
            type: Boolean,
        },
        "createdAt": {
            required: true,
            type: Date,
        },
        "updatedAt": {
            required: true,
            type: Date,
        },
    }
);

const Book = mongoose.model("Book",BookModel);

export default Book