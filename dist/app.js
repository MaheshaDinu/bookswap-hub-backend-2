"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_routes_1 = __importDefault(require("./routes/book.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const exchangeRequest_routes_1 = __importDefault(require("./routes/exchangeRequest.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const auth_middleware_1 = require("./middleware/auth.middleware");
const app = (0, express_1.default)();
//middleware
app.use(express_1.default.json());
//routes
app.use("/api/books", auth_middleware_1.authenticateToken, book_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/api/exchange-requests", auth_middleware_1.authenticateToken, exchangeRequest_routes_1.default);
app.use("/api/auth", auth_routes_1.default);
exports.default = app;
