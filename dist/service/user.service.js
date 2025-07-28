"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.createUser = void 0;
const db_1 = require("../db/db");
const createUser = (newUser) => {
    const user = {
        id: (0, db_1.getNextUserId)(),
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        location: newUser.location,
        contact: newUser.contact,
        isAdmin: newUser.isAdmin,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    db_1.userList.push(user);
    const { password } = user, userWithoutPassword = __rest(user, ["password"]); // Exclude password from the returned object for security
    return userWithoutPassword;
};
exports.createUser = createUser;
const getAllUsers = () => {
    return db_1.userList.map(((_a) => {
        var { password } = _a, user = __rest(_a, ["password"]);
        return user;
    }));
};
exports.getAllUsers = getAllUsers;
const getUserById = (userId) => {
    const user = db_1.userList.find(user => user.id === userId);
    if (!user) {
        return null;
    }
    const { password } = user, userWithoutPassword = __rest(user, ["password"]);
    return userWithoutPassword;
};
exports.getUserById = getUserById;
const updateUser = (userId, updatedUserData) => {
    const userIndex = db_1.userList.findIndex(user => user.id == userId);
    if (userIndex === -1) {
        return null;
    }
    const existingUser = db_1.userList[userIndex];
    const updatedUser = Object.assign(Object.assign(Object.assign({}, existingUser), updatedUserData), { updatedAt: new Date() });
    db_1.userList[userIndex] = updatedUser;
    const { password } = updatedUser, userWithoutPassword = __rest(updatedUser, ["password"]);
    return userWithoutPassword;
};
exports.updateUser = updateUser;
const deleteUser = (userId) => {
    const userIndex = db_1.userList.findIndex(user => user.id === userId);
    if (userIndex === -1) {
        return null;
    }
    const [deletedUser] = db_1.userList.splice(userIndex, 1);
    const { password } = deletedUser, userWithoutPassword = __rest(deletedUser, ["password"]);
    return userWithoutPassword;
};
exports.deleteUser = deleteUser;
const validateUser = (user, isNewUser = false, currentUserId) => {
    if (isNewUser) {
        if (!user.name || typeof user.name !== 'string' || user.name.trim().length === 0) {
            return "Name is required and must be a non-empty string.";
        }
        if (!user.email || typeof user.email !== 'string' || user.email.trim().length === 0) {
            return "Email is required and must be a non-empty string.";
        }
        if (!user.password || typeof user.password !== 'string' || user.password.length < 6) {
            return "Password is required and must be at least 6 characters long.";
        }
        // Check if email already exists
        if (db_1.userList.some(u => u.email === user.email)) {
            return "Email already exists.";
        }
    }
    else { // For updates
        if (user.email && db_1.userList.some(u => u.email === user.email && u.id !== currentUserId)) {
            return "Email already exists for another user.";
        }
    }
    return null;
};
exports.validateUser = validateUser;
