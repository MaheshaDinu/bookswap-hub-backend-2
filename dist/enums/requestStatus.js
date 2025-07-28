"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["PENDING"] = "pending";
    RequestStatus["ACCEPTED"] = "accepted";
    RequestStatus["DECLINED"] = "declined";
    RequestStatus["CANCELLED"] = "cancelled";
    RequestStatus["COMPLETED"] = "completed";
})(RequestStatus || (RequestStatus = {}));
exports.default = RequestStatus;
