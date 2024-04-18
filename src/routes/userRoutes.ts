import { Router } from "express";
import { 
    fetchAllUsers, 
    createUserController,
    userLogin } 
from "../controllers/userControllers";

const userRoutes = Router();

userRoutes.get("/",  fetchAllUsers);

userRoutes.post("/users/register", createUserController)
userRoutes.post('/login',userLogin);

export default userRoutes;
