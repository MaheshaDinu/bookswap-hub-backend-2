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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBooksByUserId = exports.deleteBook = exports.updateBook = exports.getBookById = exports.getAllBooks = exports.createBook = void 0;
const bookService = __importStar(require("../service/book.service"));
const createBook = (req, res) => {
    try {
        const newBook = req.body;
        const validationError = bookService.validateBook(newBook);
        if (validationError) {
            res.status(400).json({ message: validationError });
            return;
        }
        const createdBook = bookService.createBook(newBook);
        res.status(201).json(createdBook);
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};
exports.createBook = createBook;
const getAllBooks = (req, res) => {
    try {
        const books = bookService.getAllBooks();
        res.status(200).json(books);
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};
exports.getAllBooks = getAllBooks;
const getBookById = (req, res) => {
    try {
        const bookId = parseInt(req.params.id);
        const book = bookService.getBookById(bookId);
        if (!book) {
            res.status(404).json({ message: "Book not found" });
            return;
        }
        res.status(200).json(book);
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};
exports.getBookById = getBookById;
const updateBook = (req, res) => {
    try {
        const bookId = parseInt(req.params.id);
        const updatedBook = req.body;
        const validationError = bookService.validateBook(updatedBook);
        if (validationError) {
            res.status(400).json({ message: validationError });
            return;
        }
        const updated = bookService.updateBook(bookId, updatedBook);
        if (!updated) {
            res.status(404).json({ message: "Book not found" });
            return;
        }
        res.status(200).json(updated);
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};
exports.updateBook = updateBook;
const deleteBook = (req, res) => {
    try {
        const bookId = parseInt(req.params.id);
        const deleted = bookService.deleteBook(bookId);
        if (!deleted) {
            res.status(404).json({ message: "Book not found" });
            return;
        }
        res.status(200).json({ message: "Book deleted successfully" });
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};
exports.deleteBook = deleteBook;
const getBooksByUserId = (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const books = bookService.getBooksByUserId(userId);
        if (!books) {
            res.status(404).json({ message: "User do not have books" });
            return;
        }
        res.status(200).json(books);
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};
exports.getBooksByUserId = getBooksByUserId;
