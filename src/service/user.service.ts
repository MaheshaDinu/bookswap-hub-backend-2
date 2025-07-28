import {User} from "../models/user.model";
import {getNextUserId, userList} from "../db/db";

export const createUser = (newUser: Omit<User, "id" | "createdAt" | "updatedAt">) =>
{


        const user: User = {
            id: getNextUserId(),
            name: newUser.name,
            email: newUser.email,
            password: newUser.password,
            location: newUser.location,
            contact: newUser.contact,
            isAdmin: newUser.isAdmin,
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        userList.push(user)
        const { password, ...userWithoutPassword } = user; // Exclude password from the returned object for security
        return userWithoutPassword as User;

}

export const getAllUsers = ():Omit<User, "password">[] => {

        return userList.map((({password, ...user})=> user));


}

export const getUserById = (userId: number): Omit<User, 'password'> | null => {
    const user = userList.find(user => user.id === userId);
    if (!user) {
        return null;
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
};


export const updateUser = (userId: number, updatedUserData: Partial<User>):Omit<User, "password"> | null => {

        const userIndex = userList.findIndex(user => user.id == userId);
        if (userIndex === -1) {
            return null;
        }
        const existingUser = userList[userIndex];
        const updatedUser: User = {
            ...existingUser,
            ...updatedUserData,
            updatedAt: new Date(),
        };
        userList[userIndex] = updatedUser;
        const {password, ...userWithoutPassword} = updatedUser;
        return userWithoutPassword as Omit<User, "password">;


}

export const deleteUser = (userId: number) :Omit<User, "password"> | null => {

        const userIndex = userList.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return null;
        }
        const [deletedUser] = userList.splice(userIndex, 1);
        const { password, ...userWithoutPassword } = deletedUser;
        return userWithoutPassword as User;

}


export const validateUser = (user: Partial<User>, isNewUser: boolean = false, currentUserId?: number): string | null => {
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
        if (userList.some(u => u.email === user.email)) {
            return "Email already exists.";
        }
    } else { // For updates
        if (user.email && userList.some(u => u.email === user.email && u.id !== currentUserId)) {
            return "Email already exists for another user.";
        }
    }
    return null;
};

