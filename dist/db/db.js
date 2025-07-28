"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateExchangeRequestId = exports.exchangeRequestsList = exports.getNextUserId = exports.userList = exports.booksList = void 0;
exports.booksList = [];
exports.userList = [];
let nextUserId = 1;
const getNextUserId = () => nextUserId++;
exports.getNextUserId = getNextUserId;
exports.exchangeRequestsList = []; // In-memory array
let nextExchangeRequestId = 1; // Simple counter for unique IDs
const generateExchangeRequestId = () => {
    return nextExchangeRequestId++;
};
exports.generateExchangeRequestId = generateExchangeRequestId;
