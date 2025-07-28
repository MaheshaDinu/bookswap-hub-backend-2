"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExchangeRequest = exports.updateExchangeRequestStatus = exports.getReceivedExchangeRequests = exports.getSentExchangeRequests = exports.getExchangeRequestById = exports.getAllExchangeRequests = exports.createExchangeRequest = void 0;
const exchangeRequestService = __importStar(require("../service/exchangeRequest.service"));
// Controller for creating an exchange request
const createExchangeRequest = (req, res) => {
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
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};
exports.createExchangeRequest = createExchangeRequest;
// Controller for getting all exchange requests (e.g., for admin)
const getAllExchangeRequests = (req, res) => {
    try {
        const requests = exchangeRequestService.getAllExchangeRequests();
        res.status(200).json(requests);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};
exports.getAllExchangeRequests = getAllExchangeRequests;
// Controller for getting a single exchange request by ID
const getExchangeRequestById = (req, res) => {
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
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};
exports.getExchangeRequestById = getExchangeRequestById;
// Controller for getting requests sent by a specific user
const getSentExchangeRequests = (req, res) => {
    try {
        const requesterId = parseInt(req.params.userId); // In authenticated app, this would be req.user.id
        if (isNaN(requesterId)) {
            return res.status(400).json({ message: "Invalid User ID." });
        }
        const requests = exchangeRequestService.getSentExchangeRequests(requesterId);
        res.status(200).json(requests);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};
exports.getSentExchangeRequests = getSentExchangeRequests;
// Controller for getting requests received by a specific user (on their books)
const getReceivedExchangeRequests = (req, res) => {
    try {
        const ownerId = parseInt(req.params.userId); // In authenticated app, this would be req.user.id
        if (isNaN(ownerId)) {
            return res.status(400).json({ message: "Invalid User ID." });
        }
        const requests = exchangeRequestService.getReceivedExchangeRequests(ownerId);
        res.status(200).json(requests);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};
exports.getReceivedExchangeRequests = getReceivedExchangeRequests;
// Controller for updating the status of an exchange request (accept/reject/complete)
const updateExchangeRequestStatus = (req, res) => {
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
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};
exports.updateExchangeRequestStatus = updateExchangeRequestStatus;
// Controller for deleting an exchange request
const deleteExchangeRequest = (req, res) => {
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
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};
exports.deleteExchangeRequest = deleteExchangeRequest;
