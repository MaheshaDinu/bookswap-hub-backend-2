import {BookDto} from "../dto/Book.dto";
import Book from "../models/book.model";

export const createBook = async (newBook: BookDto) => {
    newBook.id = await generateBookId();
    newBook.createdAt = new Date();
    newBook.updatedAt = new Date();
    newBook.isAvailable = true;
    const book:BookDto = await Book.create(newBook);
    return book;
}

export const getAllBooks = async ():Promise<BookDto[]> => {
    return Book.find();
}

export const getBookById = async (bookId: number):Promise<BookDto | null> => {
    return Book.findOne({id: bookId});

}

export const updateBook = async (bookId: number, updatedBook: BookDto):Promise<BookDto | null> => {
    const book = await Book.findOneAndUpdate({id:bookId},updatedBook,{new: true});
    if (!book) {
        return null;
    }
    return book;
}

export const deleteBook = async (bookId: number):Promise<BookDto | null> => {
    const deletedBook = await Book.findOneAndDelete({id:bookId});
    if (!deletedBook) {
        return null;
    }
    return deletedBook;
}

export const getBooksByUserId = async (userId: number):Promise<BookDto[] | null> => {
    const books = await Book.find({ownerId: userId});
    if (!books) {
        return null;
    }
    return books;
}

export const validateBook = (book: BookDto) => {
    if (!book.title || !book.author || !book.category || !book.description || !book.condition) {
        return "All fields are required.";
    }
    return null;
}

export const generateBookId = async () => {
    const books = await getAllBooks();
    if (books.length == 0) {
        return 1;
    }
    const lastBook = books[books.length - 1];
    return lastBook.id + 1;
}