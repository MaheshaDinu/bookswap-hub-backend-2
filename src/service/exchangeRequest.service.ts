import {ExchangeRequestDto} from "../dto/ExchangeRequest.dto";
import ExchangeRequest from "../models/exchangeRequest.model";
import RequestStatus from "../enums/requestStatus";
import requestStatus from "../enums/requestStatus";

async function generateExchangeRequestId() {
    const existingRequests = await getAllExchangeRequests();
    if (existingRequests.length === 0) {
        return 1;
    }
    const lastRequest = existingRequests[existingRequests.length - 1];
    return lastRequest.id + 1;

}

export const createExchangeRequest = async (newRequestData: ExchangeRequestDto) =>{
    newRequestData.id = await generateExchangeRequestId();
    return ExchangeRequest.create(newRequestData);
}
export const getAllExchangeRequests = async ():Promise<ExchangeRequestDto[]> => {
    return ExchangeRequest.find();
}
export const getExchangeRequestById = async (requestId: number):Promise<ExchangeRequestDto | null> => {
    return ExchangeRequest.findOne({id: requestId});
}

export const deleteExchangeRequest = async (requestId: number):Promise<any> => {
    const deletedRequest = await ExchangeRequest.findOneAndDelete({id: requestId});
    if (!deletedRequest) {
        return null;
    }
    return deletedRequest;
}
export const updateExchangeRequest = async (requestId: number, updatedRequestData: Partial<ExchangeRequestDto>):Promise<any> => {
    const updatedRequest = await ExchangeRequest.findOneAndUpdate({id: requestId}, updatedRequestData, {new: true});
    if (!updatedRequest) {
        return null;
    }
    return updatedRequest;
}
export const getSentExchangeRequests = async (requesterId: number): Promise<any> => {
    try {
        return await ExchangeRequest.find({requester_id: requesterId}).sort({createdAt: -1});
    } catch (error) {
        console.error(`Error getting sent exchange requests for user ${requesterId}:`, error);
        throw new Error(`Failed to retrieve sent exchange requests for user ${requesterId}.`);
    }
};

export const getReceivedExchangeRequests = async (receiverId: number): Promise<any> => {
    try {
        return await ExchangeRequest.find({receiver_id: receiverId}).sort({createdAt: -1});
    } catch (error) {
        console.error(`Error getting received exchange requests for user ${receiverId}:`, error);
        throw new Error(`Failed to retrieve received exchange requests for user ${receiverId}.`);
    }
};
export const updateExchangeRequestStatus = async (
    requestId: number,
    newStatus: RequestStatus,
    currentUserId: number
): Promise<any> => {
    try {
        const request = await ExchangeRequest.findOne({ id: requestId });

        if (!request) {
            return null; // Request not found
        }

        // Authorization and Status Transition Logic
        if (newStatus === RequestStatus.ACCEPTED || newStatus === RequestStatus.DECLINED) {
            // Only the receiver can accept or reject
            if (request.receiver_id !== currentUserId) {
                return "You are not authorized to accept or reject this request.";
            }
            // Cannot change status if already accepted, rejected, or completed
            if (request.status in [RequestStatus.ACCEPTED, RequestStatus.DECLINED, RequestStatus.COMPLETED]) {
                return `Request is already ${request.status}. Cannot change to ${newStatus}.`;
            }
        } else if (newStatus === RequestStatus.COMPLETED) {
            // Both requester and receiver can mark as completed, but only if accepted
            if (request.requester_id !== currentUserId && request.receiver_id !== currentUserId) {
                return "You are not authorized to complete this request.";
            }
            if (request.status !== RequestStatus.ACCEPTED) {
                return "Only accepted requests can be marked as completed.";
            }
        } else if (newStatus === RequestStatus.PENDING) {
            return "Cannot revert status to Pending directly."; // Status should not be set back to pending
        }

        request.status = newStatus;
        request.updatedAt = new Date(); // Update timestamp

        const updatedRequest = await ExchangeRequest.findOneAndUpdate({ id: requestId }, request, { new: true });
        return updatedRequest as ExchangeRequestDto;
    } catch (error) {
        console.error(`Error updating exchange request status for ID ${requestId}:`, error);
        throw new Error(`Failed to update exchange request status for ID ${requestId}.`);
    }
};

export const validateExchangeRequest = async (requestdata: ExchangeRequestDto):Promise<string | null> => {
    if (requestdata.requester_id === requestdata.receiver_id) {
        return "Requester and receiver cannot be the same.";
    }
    if (!requestdata.status) {
        return "Status is required.";
    }
    if (requestdata.status !== RequestStatus.PENDING) {
        return "Status must be 'pending'.";
    }
    if (!requestdata.requester_id) {
        return "Requester ID is required.";
    }
    if (!requestdata.receiver_id) {
        return "Receiver ID is required.";
    }
    if (!requestdata.requested_book_id) {
        return "Requested Book ID is required.";
    }
    return null;
}