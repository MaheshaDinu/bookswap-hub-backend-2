import dotenv from 'dotenv';
import {UserDto} from "../dto/User.dto";
import {userList} from "../db/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const REFRESH_SECRET = process.env.REFRESH_SECRET as string;

const refreshTokens = new Set<string>();

export const authenticateUser = (email: string, password: string) => {
    const existingUser: UserDto | undefined = userList.find(user => user.email === email);

    let isValidPassword = undefined != existingUser
        && bcrypt.compareSync(password, existingUser.password);
    if (!existingUser || !isValidPassword) {
        return null;
    }

    const accessToken = jwt.sign({
        id: existingUser.id,
        username: existingUser.email,
        role: existingUser.isAdmin
    }, JWT_SECRET, {expiresIn: "5m"});

    const refreshToken = jwt.sign({
        username: existingUser.email
    }, REFRESH_SECRET, {expiresIn: "7d"});
    refreshTokens.add(refreshToken);
    return {accessToken, refreshToken}
}