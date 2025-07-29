import mongoose from "mongoose";

const UserModel = new mongoose.Schema({
    "id":{
        required: true,
        type: Number,
        unique: true,
        index: true,
    },
    "name":{
        required: true,
        type: String,
    },
    "email": {
        required: true,
        type: String,
        unique: true,
        index: true,
    },
    "password": {
        required: true,
        type: String,
        select: false,
    },
    "isAdmin": {
        required: true,
        type: Boolean,
    },
    "location": {
        required: true,
        type: String,
    },
    "contact": {
        required: true,
        type: String,
    },
    "createdAt": {
        required: true,
        type: Date,
    },
    "updatedAt": {
        required: true,
        type: Date,
    },
});

const User = mongoose.model("User", UserModel);

export default User;
