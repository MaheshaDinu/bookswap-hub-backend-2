"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("../db/db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const refreshTokens = new Set();
const authenticateUser = (email, password) => {
    const existingUser = db_1.userList.find(user => user.email === email);
    let isValidPassword = undefined != existingUser
        && bcryptjs_1.default.compareSync(password, existingUser.password);
    if (!existingUser || !isValidPassword) {
        return null;
    }
    const accessToken = jsonwebtoken_1.default.sign({
        id: existingUser.id,
        username: existingUser.email,
        role: existingUser.isAdmin
    }, JWT_SECRET, { expiresIn: "5m" });
    const refreshToken = jsonwebtoken_1.default.sign({
        username: existingUser.email
    }, REFRESH_SECRET, { expiresIn: "7d" });
    refreshTokens.add(refreshToken);
    return { accessToken, refreshToken };
};
exports.authenticateUser = authenticateUser;
