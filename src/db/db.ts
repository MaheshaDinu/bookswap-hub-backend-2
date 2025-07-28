import {Book} from "../dto/Book.dto";
import {User} from "../models/user.model";
import {ExchangeRequest} from "../models/exchangeRequest.model";

export const booksList: Book[] = [];


export const userList: User[] = [];
let nextUserId = 1;

export const getNextUserId = () => nextUserId++;

export const exchangeRequestsList: ExchangeRequest[] = []; // In-memory array
let nextExchangeRequestId = 1; // Simple counter for unique IDs

export const generateExchangeRequestId = (): number => {
    return nextExchangeRequestId++;
};