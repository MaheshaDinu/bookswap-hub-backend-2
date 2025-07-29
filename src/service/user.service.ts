import User from "../models/user.model";
import {UserDto} from "../dto/User.dto";


export const createUser = async (newUser: Omit<UserDto, "id" | "createdAt" | "updatedAt">):Promise<Omit<UserDto, "password">[]> =>
{


        const userDto = {
            id: await getNextUserId(),
            name: newUser.name,
            email: newUser.email,
            password: newUser.password,
            location: newUser.location,
            contact: newUser.contact,
            isAdmin: newUser.isAdmin,
            createdAt: new Date(),
            updatedAt: new Date(),
        };


          return  User.create(userDto);

}

export const getAllUsers = async ():Promise<Omit<UserDto, "password">[]> => {
    return User.find()
}

export const getUserById = async (userId: number):Promise<Omit<User, 'password'>  | null> => {
    const user = User.findOne({id: userId});
    if (!user) {
        return null;
    }
    const {password, ...userWithoutPassword} = user;
    return userWithoutPassword as Omit<User, "password">
};


export const updateUser = async (userId: number, updatedUserData: Partial<User>):Promise<Omit<User, "password"> | null> => {
    const updatedUser = User.findOneAndUpdate({id: userId}, updatedUserData, {new: true});
    if (!updatedUser) {
        return null;
    }
    return updatedUser as Omit<User, "password">;


}

export const deleteUser = async (userId: number) :Promise<Omit<User, "password"> | null> => {

    const deletedUser = User.findOneAndDelete({id: userId});
    if (!deletedUser) {
        return null;
    }
    return deletedUser as Omit<User, "password">

}


export const validateUser = async (user: Partial<UserDto>, isNewUser: boolean = false, currentUserId?: number):Promise<string | null>  => {
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
        try {
            const existingUser = await User.findOne({email: user.email});
            if (existingUser) {
                return "Email already exists.";
            }
        } catch (error) {
            console.error("Database error during email existence check:", error);
            return "Server error: Could not check email existence.";
        }


    } else { // For updates
        if (currentUserId === undefined) {
            return "User ID is required for updates.";
        }
        try {
            const conflictUser = await User.findOne({email: user.email, id: {$ne: currentUserId}}).select("id");
            if (conflictUser) {
                return "Email already exists for another user.";
            }
        }catch (dbError) {
            console.error("Database error during email conflict check for update:", dbError);
            return "Server error: Could not check email conflict.";
        }
    }
    return null;
};

export const getNextUserId = async () => {
    const users:Omit<UserDto,"password">[] = await getAllUsers();
    if (users.length === 0) {
        return 1;
    }
    const lastUser = users[users.length - 1];
    return lastUser.id + 1;
};

