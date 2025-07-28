import {Book} from "../dto/Book.dto";
import {booksList} from "../db/db";

export const createBook = (newBook: Book) => {
    newBook.createdAt = new Date();
    newBook.updatedAt = new Date();
    newBook.isAvailable = true;
    booksList.push(newBook)
    return newBook
}

export const getAllBooks = () => {
    return booksList;
}

export const getBookById = (bookId: number) => {
    return booksList.find(book => book.id == bookId);

}

export const updateBook = (bookId: number, updatedBook: Book) => {
    const bookIndex = booksList.findIndex(book => book.id == bookId);
    if (bookIndex == -1) {
        return null;
    }
    updatedBook.updatedAt = new Date();
    booksList[bookIndex] = updatedBook;
    return updatedBook
}

export const deleteBook = (bookId: number) => {
    const bookIndex = booksList.findIndex(book => book.id == bookId);
    if (bookIndex == -1) {
        return null;
    }
    const deletedBook = booksList[bookIndex];
    booksList.splice(bookIndex, 1);
    return deletedBook
}

export const getBooksByUserId = (userId: number) => {
    return booksList.filter(book => book.ownerId == userId);
}

export const validateBook = (book: Book) => {
    if (!book.title || !book.author || !book.category || !book.description || !book.condition) {
        return "All fields are required.";
    }
    return null;
}