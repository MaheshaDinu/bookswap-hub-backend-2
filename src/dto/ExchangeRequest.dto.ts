import RequestStatus from "../enums/requestStatus";

export interface ExchangeRequestDto{
    id: number;
    requester_id: number;
    receiver_id: number;
    requested_book_id: number;
    offered_book_id?: number;
    status: RequestStatus;
    createdAt: Date;
    updatedAt: Date
}