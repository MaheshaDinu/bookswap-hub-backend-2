"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const conditions_enum_1 = __importDefault(require("../enums/conditions.enum")); // Ensure this path is correct
// 2. Define the Mongoose Schema
const BookSchema = new mongoose_1.Schema({
    id: {
        type: Number,
        required: [true, 'Book ID is required'],
        unique: true, // Ensures each book has a unique ID
        index: true, // Creates an index for faster queries on this field
    },
    title: {
        type: String,
        required: [true, 'Book title is required'],
        trim: true,
    },
    author: {
        type: String,
        required: [true, 'Author name is required'],
        trim: true,
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    condition: {
        type: String,
        required: [true, 'Condition is required'],
        // Use Object.values(conditions) to get the string values from your enum
        enum: Object.values(conditions_enum_1.default),
        trim: true,
    },
    ownerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: [true, 'Book must have an owner'],
    },
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required'],
        trim: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
});
// Optional: Configure toJSON to include virtuals and remove __v
BookSchema.set('toJSON', {
    virtuals: true, // Include virtual properties when converting to JSON (if you add any)
    transform: (doc, ret) => {
        // Cast 'ret' to 'any' to allow deletion in strict mode
        delete ret.__v; // Remove the version key
        // You can optionally delete _id if your frontend strictly uses 'id' (numerical)
        // delete (ret as any)._id;
    }
});
// 3. Create and Export the Mongoose Model
const Book = mongoose_1.default.model('Book', BookSchema);
exports.default = Book; // Export Book as a default export
