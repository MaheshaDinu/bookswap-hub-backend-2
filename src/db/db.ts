import {BookDto} from "../dto/Book.dto";
import {UserDto} from "../dto/User.dto";
import {ExchangeRequestDto} from "../dto/ExchangeRequest.dto";

export const booksList: BookDto[] = [];


export const userList: UserDto[] = [];
let nextUserId = 1;

export const getNextUserId = () => nextUserId++;

export const exchangeRequestsList: ExchangeRequestDto[] = []; // In-memory array
let nextExchangeRequestId = 1; // Simple counter for unique IDs

export const generateExchangeRequestId = (): number => {
    return nextExchangeRequestId++;
};