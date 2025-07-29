import dotenv from 'dotenv';
import {UserDto} from "../dto/User.dto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

const refreshTokens = new Set<string>();

export const authenticateUser = async (email: string, password: string) => {
    const existingUser: UserDto | null =  await User.findOne({email: email}).select("+password");

    let isValidPassword = undefined != existingUser && bcrypt.compareSync(password, existingUser.password);
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