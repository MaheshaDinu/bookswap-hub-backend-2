// src/service/exchangeRequest.service.ts

import {ExchangeRequest} from "../models/exchangeRequest.model";
// For demonstration, let's assume you can access booksList and usersList from your other db files
import {booksList, exchangeRequestsList, generateExchangeRequestId, userList} from "../db/db"; // Assuming book.db exports booksList
import RequestStatus from "../enums/requestStatus"; // Assuming user.db exports usersList

// Helper to simulate getting full objects
const enrichExchangeRequest = (req: ExchangeRequest) => {
    const requester = userList.find(u => u.id === req.requester_id);
    const requestedBook = booksList.find(b => b.id === req.requested_book_id);
    const offeredBook = req.offered_book_id ? booksList.find(b => b.id === req.offered_book_id) : undefined;

    // Return a more complete object (excluding passwords for users)
    return {
        ...req,
        requester: requester ? { ...requester, password: undefined } : undefined,
        requestedBook,
        offeredBook,
    };
};


// Function to create a new exchange request
export const createExchangeRequest = (newRequestData: Omit<ExchangeRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>): ExchangeRequest | string => {
    // Basic validation (more complex checks like book existence, ownership, availability come with full DB integration)
    if (!newRequestData.requester_id || !newRequestData.requested_book_id) {
        return "Requester ID and Requested Book ID are required.";
    }

    // Simulate basic business logic (e.g., a user cannot request their own book)
    const requestedBook = booksList.find(b => b.id === newRequestData.requested_book_id);
    if (requestedBook && requestedBook.ownerId === newRequestData.requester_id) {
        return "You cannot request to swap your own book.";
    }
    // You could add: check if requestedBook is actually available (isAvailable: true)

    // Simulate if offeredBookId is provided, that it belongs to the requester
    if (newRequestData.offered_book_id) {
        const offeredBook = booksList.find(b => b.id === newRequestData.offered_book_id);
        if (!offeredBook || offeredBook.ownerId !== newRequestData.requester_id) {
            return "The offered book must belong to the requester.";
        }
    }


    const request: ExchangeRequest = {
        id: generateExchangeRequestId(),
        requester_id: newRequestData.requester_id,
        requested_book_id: newRequestData.requested_book_id,
        offered_book_id: newRequestData.offered_book_id,
        status: RequestStatus.PENDING, // Default status for new requests
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    exchangeRequestsList.push(request);
    return request;
};

// Function to get all exchange requests (e.g., for admin or debugging)
export const getAllExchangeRequests = () => {
    return exchangeRequestsList.map(enrichExchangeRequest);
};

// Function to get a single exchange request by ID
export const getExchangeRequestById = (requestId: number) => {
    const request = exchangeRequestsList.find(req => req.id === requestId);
    return request ? enrichExchangeRequest(request) : null;
};

// Function to get requests sent by a specific user
export const getSentExchangeRequests = (requesterId: number) => {
    return exchangeRequestsList
        .filter(req => req.requester_id === requesterId)
        .map(enrichExchangeRequest);
};

// Function to get requests received by a specific user (on their books)
export const getReceivedExchangeRequests = (ownerId: number) => {
    return exchangeRequestsList
        .filter(req => {
            const requestedBook = booksList.find(b => b.id === req.requested_book_id);
            return requestedBook && requestedBook.ownerId === ownerId;
        })
        .map(enrichExchangeRequest);
};


// Function to update the status of an exchange request (accept/reject/complete)
export const updateExchangeRequestStatus = (
    requestId: number,
    newStatus: RequestStatus,
    currentUserId: number // For authorization: the user performing the action
): ExchangeRequest | string | null => {
    const requestIndex = exchangeRequestsList.findIndex(req => req.id === requestId);
    if (requestIndex === -1) {
        return null; // Request not found
    }

    const request = exchangeRequestsList[requestIndex];
    const requestedBook = booksList.find(b => b.id === request.requested_book_id);

    // Authorization check: Only the owner of the requested book can accept/reject
    // Or, for 'completed', either the requester or the owner can mark it as complete
    if (!requestedBook) {
        return "Requested book not found for this exchange request.";
    }

    if (newStatus === RequestStatus.ACCEPTED || newStatus === RequestStatus.DECLINED) {
        if (requestedBook.ownerId !== currentUserId) {
            return "Only the owner of the requested book can accept or reject this request.";
        }
    } else if (newStatus === RequestStatus.COMPLETED) {
        if (requestedBook.ownerId !== currentUserId && request.requester_id !== currentUserId) {
            return "Only the requester or the owner of the requested book can mark this request as completed.";
        }
    }


    // Logic for status transitions (optional but good practice)
    if (newStatus === RequestStatus.ACCEPTED && request.status !== RequestStatus.PENDING) {
        return "Only pending requests can be accepted.";
    }
    if (newStatus === RequestStatus.DECLINED && request.status !== RequestStatus.PENDING) {
        return "Only pending requests can be rejected.";
    }
    if (newStatus === RequestStatus.COMPLETED && request.status !== RequestStatus.ACCEPTED) {
        return "Only accepted requests can be marked as completed.";
    }


    request.status = newStatus;
    request.updatedAt = new Date();

    // Side effects (in a real app, this is where you'd change book availability, ownership, etc.)
    if (newStatus === RequestStatus.ACCEPTED) {
        // Mark both books as unavailable if it's a 1:1 swap, or just the requested book
        if (requestedBook) requestedBook.isAvailable = false;
        if (request.offered_book_id) {
            const offeredBook = booksList.find(b => b.id === request.offered_book_id);
            if (offeredBook) offeredBook.isAvailable = false;
        }
        // In a real app, you might also automatically reject other pending requests for these books
    } else if (newStatus === RequestStatus.DECLINED) {
        // If rejected, ensure books go back to available if they were marked otherwise
        if (requestedBook) requestedBook.isAvailable = true; // Assume it was still available if pending
        if (request.offered_book_id) {
            const offeredBook = booksList.find(b => b.id === request.offered_book_id);
            if (offeredBook) offeredBook.isAvailable = true;
        }
    } else if (newStatus === RequestStatus.COMPLETED) {
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


    exchangeRequestsList[requestIndex] = request;
    return request;
};

// Function to delete an exchange request (e.g., requester cancels a pending request)
export const deleteExchangeRequest = (requestId: number, currentUserId: number): ExchangeRequest | string | null => {
    const requestIndex = exchangeRequestsList.findIndex(req => req.id === requestId);
    if (requestIndex === -1) {
        return null;
    }

    const request = exchangeRequestsList[requestIndex];

    // Authorization: Only the requester can delete a pending request
    if (request.requester_id !== currentUserId) {
        return "You are not authorized to delete this request.";
    }
    if (request.status !== 'pending') {
        return "Only pending requests can be deleted.";
    }

    const [deletedRequest] = exchangeRequestsList.splice(requestIndex, 1);
    return deletedRequest;
};

// Basic validation for creating an exchange request
export const validateExchangeRequest = (request: Partial<ExchangeRequest>): string | null => {
    if (!request.requester_id || !request.requested_book_id) {
        return "Requester ID and Requested Book ID are required.";
    }
    // Further specific validations can be added here
    return null;
};