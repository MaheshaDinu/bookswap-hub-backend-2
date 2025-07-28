import {Router} from "express";
import {
    createExchangeRequest, deleteExchangeRequest,
    getAllExchangeRequests,
    getExchangeRequestById, getReceivedExchangeRequests, getSentExchangeRequests, updateExchangeRequestStatus
} from "../controller/exchangeRequest.controller";

const exchangeRequestRouter = Router();

exchangeRequestRouter.post("/create-request", createExchangeRequest)
exchangeRequestRouter.get("/get-all-requests", getAllExchangeRequests)
exchangeRequestRouter.get("/get-request/:id", getExchangeRequestById);
exchangeRequestRouter.get("/sent-by/:userId", getSentExchangeRequests);
exchangeRequestRouter.get("/received-by/:userId", getReceivedExchangeRequests);
exchangeRequestRouter.put("/update-status/:id/:actingUserId", updateExchangeRequestStatus);
exchangeRequestRouter.delete("/delete-request/:id/:actingUserId", deleteExchangeRequest);


export default exchangeRequestRouter;