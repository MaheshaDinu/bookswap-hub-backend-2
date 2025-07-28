import {Router} from "express";
import {createUser, deleteUser, getAllUsers, getUserById, updateUser} from "../controller/user.controller";

const userRouter = Router();

userRouter.get("/get-all-users", getAllUsers);
userRouter.get("/get-user/:id", getUserById);
userRouter.post("/create-user", createUser);
userRouter.put("/update-user/:id", updateUser);
userRouter.delete("/delete-user/:id", deleteUser);

export default userRouter;