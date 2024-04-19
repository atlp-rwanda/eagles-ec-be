import { Router } from "express";
import { 
    fetchAllUsers, 
    createUserController,
    userLogin  } 
from "../controllers/userControllers";

const userRoutes = Router();

userRoutes.get("/", fetchAllUsers);
userRoutes.post('/login',userLogin);
userRoutes.post("/", createUserController)


export default userRoutes;
