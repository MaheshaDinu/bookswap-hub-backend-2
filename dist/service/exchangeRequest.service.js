"use strict";
// src/service/exchangeRequest.service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateExchangeRequest = exports.deleteExchangeRequest = exports.updateExchangeRequestStatus = exports.getReceivedExchangeRequests = exports.getSentExchangeRequests = exports.getExchangeRequestById = exports.getAllExchangeRequests = exports.createExchangeRequest = void 0;
// For demonstration, let's assume you can access booksList and usersList from your other db files
const db_1 = require("../db/db"); // Assuming book.db exports booksList
const requestStatus_1 = __importDefault(require("../enums/requestStatus")); // Assuming user.db exports usersList
// Helper to simulate getting full objects
const enrichExchangeRequest = (req) => {
    const requester = db_1.userList.find(u => u.id === req.requester_id);
    const requestedBook = db_1.booksList.find(b => b.id === req.requested_book_id);
    const offeredBook = req.offered_book_id ? db_1.booksList.find(b => b.id === req.offered_book_id) : undefined;
    // Return a more complete object (excluding passwords for users)
    return Object.assign(Object.assign({}, req), { requester: requester ? Object.assign(Object.assign({}, requester), { password: undefined }) : undefined, requestedBook,
        offeredBook });
};
// Function to create a new exchange request
const createExchangeRequest = (newRequestData) => {
    // Basic validation (more complex checks like book existence, ownership, availability come with full DB integration)
    if (!newRequestData.requester_id || !newRequestData.requested_book_id) {
        return "Requester ID and Requested Book ID are required.";
    }
    // Simulate basic business logic (e.g., a user cannot request their own book)
    const requestedBook = db_1.booksList.find(b => b.id === newRequestData.requested_book_id);
    if (requestedBook && requestedBook.ownerId === newRequestData.requester_id) {
        return "You cannot request to swap your own book.";
    }
    // You could add: check if requestedBook is actually available (isAvailable: true)
    // Simulate if offeredBookId is provided, that it belongs to the requester
    if (newRequestData.offered_book_id) {
        const offeredBook = db_1.booksList.find(b => b.id === newRequestData.offered_book_id);
        if (!offeredBook || offeredBook.ownerId !== newRequestData.requester_id) {
            return "The offered book must belong to the requester.";
        }
    }
    const request = {
        id: (0, db_1.generateExchangeRequestId)(),
        requester_id: newRequestData.requester_id,
        requested_book_id: newRequestData.requested_book_id,
        offered_book_id: newRequestData.offered_book_id,
        status: requestStatus_1.default.PENDING, // Default status for new requests
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    db_1.exchangeRequestsList.push(request);
    return request;
};
exports.createExchangeRequest = createExchangeRequest;
// Function to get all exchange requests (e.g., for admin or debugging)
const getAllExchangeRequests = () => {
    return db_1.exchangeRequestsList.map(enrichExchangeRequest);
};
exports.getAllExchangeRequests = getAllExchangeRequests;
// Function to get a single exchange request by ID
const getExchangeRequestById = (requestId) => {
    const request = db_1.exchangeRequestsList.find(req => req.id === requestId);
    return request ? enrichExchangeRequest(request) : null;
};
exports.getExchangeRequestById = getExchangeRequestById;
// Function to get requests sent by a specific user
const getSentExchangeRequests = (requesterId) => {
    return db_1.exchangeRequestsList
        .filter(req => req.requester_id === requesterId)
        .map(enrichExchangeRequest);
};
exports.getSentExchangeRequests = getSentExchangeRequests;
// Function to get requests received by a specific user (on their books)
const getReceivedExchangeRequests = (ownerId) => {
    return db_1.exchangeRequestsList
        .filter(req => {
        const requestedBook = db_1.booksList.find(b => b.id === req.requested_book_id);
        return requestedBook && requestedBook.ownerId === ownerId;
    })
        .map(enrichExchangeRequest);
};
exports.getReceivedExchangeRequests = getReceivedExchangeRequests;
// Function to update the status of an exchange request (accept/reject/complete)
const updateExchangeRequestStatus = (requestId, newStatus, currentUserId // For authorization: the user performing the action
) => {
    const requestIndex = db_1.exchangeRequestsList.findIndex(req => req.id === requestId);
    if (requestIndex === -1) {
        return null; // Request not found
    }
    const request = db_1.exchangeRequestsList[requestIndex];
    const requestedBook = db_1.booksList.find(b => b.id === request.requested_book_id);
    // Authorization check: Only the owner of the requested book can accept/reject
    // Or, for 'completed', either the requester or the owner can mark it as complete
    if (!requestedBook) {
        return "Requested book not found for this exchange request.";
    }
    if (newStatus === requestStatus_1.default.ACCEPTED || newStatus === requestStatus_1.default.DECLINED) {
        if (requestedBook.ownerId !== currentUserId) {
            return "Only the owner of the requested book can accept or reject this request.";
        }
    }
    else if (newStatus === requestStatus_1.default.COMPLETED) {
        if (requestedBook.ownerId !== currentUserId && request.requester_id !== currentUserId) {
            return "Only the requester or the owner of the requested book can mark this request as completed.";
        }
    }
    // Logic for status transitions (optional but good practice)
    if (newStatus === requestStatus_1.default.ACCEPTED && request.status !== requestStatus_1.default.PENDING) {
        return "Only pending requests can be accepted.";
    }
    if (newStatus === requestStatus_1.default.DECLINED && request.status !== requestStatus_1.default.PENDING) {
        return "Only pending requests can be rejected.";
    }
    if (newStatus === requestStatus_1.default.COMPLETED && request.status !== requestStatus_1.default.ACCEPTED) {
        return "Only accepted requests can be marked as completed.";
    }
    request.status = newStatus;
    request.updatedAt = new Date();
    // Side effects (in a real app, this is where you'd change book availability, ownership, etc.)
    if (newStatus === requestStatus_1.default.ACCEPTED) {
        // Mark both books as unavailable if it's a 1:1 swap, or just the requested book
        if (requestedBook)
            requestedBook.isAvailable = false;
        if (request.offered_book_id) {
            const offeredBook = db_1.booksList.find(b => b.id === request.offered_book_id);
            if (offeredBook)
                offeredBook.isAvailable = false;
        }
        // In a real app, you might also automatically reject other pending requests for these books
    }
    else if (newStatus === requestStatus_1.default.DECLINED) {
        // If rejected, ensure books go back to available if they were marked otherwise
        if (requestedBook)
            requestedBook.isAvailable = true; // Assume it was still available if pending
        if (request.offered_book_id) {
            const offeredBook = db_1.booksList.find(b => b.id === request.offered_book_id);
            if (offeredBook)
                offeredBook.isAvailable = true;
        }
    }
    else if (newStatus === requestStatus_1.default.COMPLETED) {
        // This is where actual book ownership swap would occur
        // For in-memory, we can simulate this, or just mark them as completed
        // For example:
        // if (requestedBook && request.offeredBookId) {
        //     const offeredBook = booksList.find(b => b.id === request.offeredBookId);
        //     if (offeredBook) {
        //         // Simulate ownership swap (THIS IS COMPLEX AND NEEDS CAREFUL DESIGN)
        //         // For this simple in-memory, we'll just mark status
        //     }
        // }
    }
    db_1.exchangeRequestsList[requestIndex] = request;
    return request;
};
exports.updateExchangeRequestStatus = updateExchangeRequestStatus;
// Function to delete an exchange request (e.g., requester cancels a pending request)
const deleteExchangeRequest = (requestId, currentUserId) => {
    const requestIndex = db_1.exchangeRequestsList.findIndex(req => req.id === requestId);
    if (requestIndex === -1) {
        return null;
    }
    const request = db_1.exchangeRequestsList[requestIndex];
    // Authorization: Only the requester can delete a pending request
    if (request.requester_id !== currentUserId) {
        return "You are not authorized to delete this request.";
    }
    if (request.status !== 'pending') {
        return "Only pending requests can be deleted.";
    }
    const [deletedRequest] = db_1.exchangeRequestsList.splice(requestIndex, 1);
    return deletedRequest;
};
exports.deleteExchangeRequest = deleteExchangeRequest;
// Basic validation for creating an exchange request
const validateExchangeRequest = (request) => {
    if (!request.requester_id || !request.requested_book_id) {
        return "Requester ID and Requested Book ID are required.";
    }
    // Further specific validations can be added here
    return null;
};
exports.validateExchangeRequest = validateExchangeRequest;
