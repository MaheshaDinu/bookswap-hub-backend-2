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
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.createUser = void 0;
const userService = __importStar(require("../service/user.service"));
const createUser = (req, res) => {
    try {
        const newUser = req.body;
        const validationError = userService.validateUser(newUser, true); // true for new user validation
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }
        const createdUser = userService.createUser(newUser);
        res.status(201).json(createdUser);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error); // Use console.error for errors
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};
exports.createUser = createUser;
const getAllUsers = (req, res) => {
    try {
        const users = userService.getAllUsers();
        res.status(200).json(users);
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
exports.getAllUsers = getAllUsers;
const getUserById = (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) { // Check if ID is a valid number
            return res.status(400).json({ message: "Invalid User ID." });
        }
        const user = userService.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json(user);
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
exports.getUserById = getUserById;
const updateUser = (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            return res.status(400).json({ message: "Invalid User ID." });
        }
        const updatedUserData = req.body;
        const validationError = userService.validateUser(updatedUserData, false, userId); // false for update validation
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }
        const updatedUser = userService.updateUser(userId, updatedUserData);
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json(updatedUser);
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
exports.updateUser = updateUser;
const deleteUser = (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            return res.status(400).json({ message: "Invalid User ID." });
        }
        const deletedUser = userService.deleteUser(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json({ message: "User deleted successfully.", deletedUser });
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
exports.deleteUser = deleteUser;
