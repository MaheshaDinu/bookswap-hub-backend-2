

import { Request, Response } from "express";
import * as exchangeRequestService from "../service/exchangeRequest.service";
import {ExchangeRequestDto} from "../dto/ExchangeRequest.dto";
import RequestStatus from "../enums/requestStatus";

// Controller for creating an exchange request
export const createExchangeRequest = async (req: Request, res: Response) => {
    try {
        // In a real authenticated app, requesterId would come from req.user.id
        // For this non-auth example, we'll take it from body/params
        const newRequestData = req.body; // Expects { requesterId, requestedBookId, offeredBookId? }

        const validationError = await exchangeRequestService.validateExchangeRequest(newRequestData);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const result = await exchangeRequestService.createExchangeRequest(newRequestData);

        if (!result) { // Means it returned an error message
            return res.status(400).json({ message: "Exchange request could not be created." });
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
export const getAllExchangeRequests = async (req: Request, res: Response) => {
    try {
        const requests = await exchangeRequestService.getAllExchangeRequests();
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
export const getExchangeRequestById = async (req: Request, res: Response) => {
    try {
        const requestId = parseInt(req.params.id);
        if (isNaN(requestId)) {
            return res.status(400).json({ message: "Invalid Request ID." });
        }
        const request = await exchangeRequestService.getExchangeRequestById(requestId);
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
export const getSentExchangeRequests = async (req: Request, res: Response) => {
    try {
        const requesterId = parseInt(req.params.userId); // In authenticated app, this would be req.user.id
        if (isNaN(requesterId)) {
            return res.status(400).json({ message: "Invalid User ID." });
        }
        const requests = await exchangeRequestService.getSentExchangeRequests(requesterId);
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
export const getReceivedExchangeRequests = async (req: Request, res: Response) => {
    try {
        const ownerId = parseInt(req.params.userId); // In authenticated app, this would be req.user.id
        if (isNaN(ownerId)) {
            return res.status(400).json({ message: "Invalid User ID." });
        }
        const requests = await exchangeRequestService.getReceivedExchangeRequests(ownerId);
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
export const updateExchangeRequestStatus = async (req: Request, res: Response) => {
    try {
        const requestId = parseInt(req.params.id);
        if (isNaN(requestId)) {
            return res.status(400).json({ message: "Invalid Request ID." });
        }
        const { status } = req.body; // Expects { status: 'accepted' | 'rejected' | 'completed' }
        const currentUserId = parseInt(req.params.actingUserId); // Simulate authenticated user for now

        if (![RequestStatus.ACCEPTED, RequestStatus.DECLINED, RequestStatus.COMPLETED].includes(status)) {
            return res.status(400).json({ message: "Invalid status provided. Must be 'ACCEPTED', 'DECLINED', or 'COMPLETED'." });
        }
        if (isNaN(currentUserId)) {
            return res.status(400).json({ message: "Acting User ID is required for this action." });
        }


        const result = await exchangeRequestService.updateExchangeRequestStatus(requestId, status, currentUserId);

        if( typeof result === 'string') {
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
export const deleteExchangeRequest = async (req: Request, res: Response) => {
    try {
        const requestId = parseInt(req.params.id);
        if (isNaN(requestId)) {
            return res.status(400).json({ message: "Invalid Request ID." });
        }
        const currentUserId = parseInt(req.params.actingUserId); // Simulate authenticated user for now
        if (isNaN(currentUserId)) {
            return res.status(400).json({ message: "Acting User ID is required for this action." });
        }

        const result = await exchangeRequestService.deleteExchangeRequest(requestId);


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