import mongoose from "mongoose";
import RequestStatus from "../enums/requestStatus";

const ExchangeRequestModel = new mongoose.Schema({
    "id": {
        required: true,
        type: Number,
        unique: true,
        index: true,
    },
    "requester_id": {
        required: true,
        type: Number,
    },
    "receiver_id": {
        required: true,
        type: Number,
    },
    "requested_book_id": {
        type: Number,
    },
    "book_id": {
        required: true,
        type: Number,
    },
    "status": {
        required: true,
        type: String,
        enum: Object.values(RequestStatus)
    },
    "createdAt": {
        required: true,
        type: Date,
        default: Date.now
    },
    "updatedAt": {
        required: true,
        type: Date,
        default: Date.now
    }
},{
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

const ExchangeRequest = mongoose.model("ExchangeRequest", ExchangeRequestModel);

export default ExchangeRequest;