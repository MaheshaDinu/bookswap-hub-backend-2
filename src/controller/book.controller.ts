import { Request, Response } from "express";
import * as bookService from "../service/book.service";

export const createBook = async (req:Request, res:Response) => {
    try {
        const newBook = req.body;
        const validationError =  bookService.validateBook(newBook)
        if (validationError) {
            res.status(400).json({ message: validationError });
            return ;
        }
        const createdBook = await bookService.createBook(newBook);
        res.status(201).json(createdBook);
    }catch (error) {
        if (error instanceof Error) {
            console.log(error)
            res.status(500).json({message: error.message});
        }else {
            res.status(500).json({ message: "An unknown error occurred" });
        }

    }
}

export const getAllBooks = async (req:Request, res:Response) => {
    try {
        const books = await bookService.getAllBooks();
        res.status(200).json(books);
    } catch (error) {
        if (error instanceof Error) {
            console.log(error)
            res.status(500).json({message: error.message});
        }else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
}

export const getBookById = async (req:Request, res:Response) => {
    try {
        const bookId = parseInt(req.params.id);
        const book = await bookService.getBookById(bookId);
        if (!book) {
            res.status(404).json({ message: "Book not found" });
            return;
        }
        res.status(200).json(book);
    }catch (error) {
        if (error instanceof Error) {
            console.log(error)
            res.status(500).json({message: error.message});
        }else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
}

export const updateBook = async (req:Request, res:Response) => {
    try {
        const bookId = parseInt(req.params.id);
        const updatedBook = req.body;
        const validationError = await bookService.validateBook(updatedBook)
        if (validationError) {
            res.status(400).json({ message: validationError });
            return ;
        }
        const updated = bookService.updateBook(bookId, updatedBook);
        if (!updated) {
            res.status(404).json({ message: "Book not found" });
            return;
        }
        res.status(200).json(updated);
    }catch (error) {
        if (error instanceof Error) {
            console.log(error)
            res.status(500).json({message: error.message});
        }else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
}

export const deleteBook = async (req:Request, res:Response) => {
    try {
        const bookId = parseInt(req.params.id);
        const deleted = await bookService.deleteBook(bookId);
        if (!deleted) {
            res.status(404).json({ message: "Book not found" });
            return;
        }
        res.status(200).json({ message: "Book deleted successfully" });
    }catch (error) {
        if (error instanceof Error) {
            console.log(error)
            res.status(500).json({message: error.message});
        }else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
}

export const getBooksByUserId = async (req:Request, res:Response) => {
    try {
        const userId = parseInt(req.params.id)
        const books = await bookService.getBooksByUserId(userId);
        if (!books) {
            res.status(404).json({ message: "User do not have books" });
            return;
        }
        res.status(200).json(books);
    }catch (error) {
        if (error instanceof Error) {
            console.log(error)
            res.status(500).json({message: error.message});
        }else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
}
