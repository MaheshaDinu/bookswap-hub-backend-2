"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBook = exports.getBooksByUserId = exports.deleteBook = exports.updateBook = exports.getBookById = exports.getAllBooks = exports.createBook = void 0;
const db_1 = require("../db/db");
const createBook = (newBook) => {
    newBook.createdAt = new Date();
    newBook.updatedAt = new Date();
    newBook.isAvailable = true;
    db_1.booksList.push(newBook);
    return newBook;
};
exports.createBook = createBook;
const getAllBooks = () => {
    return db_1.booksList;
};
exports.getAllBooks = getAllBooks;
const getBookById = (bookId) => {
    return db_1.booksList.find(book => book.id == bookId);
};
exports.getBookById = getBookById;
const updateBook = (bookId, updatedBook) => {
    const bookIndex = db_1.booksList.findIndex(book => book.id == bookId);
    if (bookIndex == -1) {
        return null;
    }
    updatedBook.updatedAt = new Date();
    db_1.booksList[bookIndex] = updatedBook;
    return updatedBook;
};
exports.updateBook = updateBook;
const deleteBook = (bookId) => {
    const bookIndex = db_1.booksList.findIndex(book => book.id == bookId);
    if (bookIndex == -1) {
        return null;
    }
    const deletedBook = db_1.booksList[bookIndex];
    db_1.booksList.splice(bookIndex, 1);
    return deletedBook;
};
exports.deleteBook = deleteBook;
const getBooksByUserId = (userId) => {
    return db_1.booksList.filter(book => book.ownerId == userId);
};
exports.getBooksByUserId = getBooksByUserId;
const validateBook = (book) => {
    if (!book.title || !book.author || !book.category || !book.description || !book.condition) {
        return "All fields are required.";
    }
    return null;
};
exports.validateBook = validateBook;
