

import { Request, Response } from "express";
import * as exchangeRequestService from "../service/exchangeRequest.service";

// Controller for creating an exchange request
export const createExchangeRequest = (req: Request, res: Response) => {
    try {
        // In a real authenticated app, requesterId would come from req.user.id
        // For this non-auth example, we'll take it from body/params
        const newRequestData = req.body; // Expects { requesterId, requestedBookId, offeredBookId? }

        const validationError = exchangeRequestService.validateExchangeRequest(newRequestData);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const result = exchangeRequestService.createExchangeRequest(newRequestData);

        if (typeof result === 'string') { // Means it returned an error message
            return res.status(400).json({ message: result });
        }

        res.status(201).json(result);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};

// Controller for getting all exchange requests (e.g., for admin)
export const getAllExchangeRequests = (req: Request, res: Response) => {
    try {
        const requests = exchangeRequestService.getAllExchangeRequests();
        res.status(200).json(requests);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};

// Controller for getting a single exchange request by ID
export const getExchangeRequestById = (req: Request, res: Response) => {
    try {
        const requestId = parseInt(req.params.id);
        if (isNaN(requestId)) {
            return res.status(400).json({ message: "Invalid Request ID." });
        }
        const request = exchangeRequestService.getExchangeRequestById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Exchange request not found." });
        }
        res.status(200).json(request);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};

// Controller for getting requests sent by a specific user
export const getSentExchangeRequests = (req: Request, res: Response) => {
    try {
        const requesterId = parseInt(req.params.userId); // In authenticated app, this would be req.user.id
        if (isNaN(requesterId)) {
            return res.status(400).json({ message: "Invalid User ID." });
        }
        const requests = exchangeRequestService.getSentExchangeRequests(requesterId);
        res.status(200).json(requests);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};

// Controller for getting requests received by a specific user (on their books)
export const getReceivedExchangeRequests = (req: Request, res: Response) => {
    try {
        const ownerId = parseInt(req.params.userId); // In authenticated app, this would be req.user.id
        if (isNaN(ownerId)) {
            return res.status(400).json({ message: "Invalid User ID." });
        }
        const requests = exchangeRequestService.getReceivedExchangeRequests(ownerId);
        res.status(200).json(requests);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};

// Controller for updating the status of an exchange request (accept/reject/complete)
export const updateExchangeRequestStatus = (req: Request, res: Response) => {
    try {
        const requestId = parseInt(req.params.id);
        if (isNaN(requestId)) {
            return res.status(400).json({ message: "Invalid Request ID." });
        }
        const { status } = req.body; // Expects { status: 'accepted' | 'rejected' | 'completed' }
        const currentUserId = parseInt(req.params.actingUserId); // Simulate authenticated user for now

        if (!['accepted', 'rejected', 'completed'].includes(status)) {
            return res.status(400).json({ message: "Invalid status provided. Must be 'accepted', 'rejected', or 'completed'." });
        }
        if (isNaN(currentUserId)) {
            return res.status(400).json({ message: "Acting User ID is required for this action." });
        }


        const result = exchangeRequestService.updateExchangeRequestStatus(requestId, status, currentUserId);

        if (typeof result === 'string') {
            return res.status(403).json({ message: result }); // 403 Forbidden for authorization issues
        }
        if (!result) {
            return res.status(404).json({ message: "Exchange request not found." });
        }
        res.status(200).json(result);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};

// Controller for deleting an exchange request
export const deleteExchangeRequest = (req: Request, res: Response) => {
    try {
        const requestId = parseInt(req.params.id);
        if (isNaN(requestId)) {
            return res.status(400).json({ message: "Invalid Request ID." });
        }
        const currentUserId = parseInt(req.params.actingUserId); // Simulate authenticated user for now
        if (isNaN(currentUserId)) {
            return res.status(400).json({ message: "Acting User ID is required for this action." });
        }

        const result = exchangeRequestService.deleteExchangeRequest(requestId, currentUserId);

        if (typeof result === 'string') {
            return res.status(403).json({ message: result }); // 403 Forbidden for authorization issues
        }
        if (!result) {
            return res.status(404).json({ message: "Exchange request not found." });
        }
        res.status(200).json({ message: "Exchange request deleted successfully.", deletedRequest: result });
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};