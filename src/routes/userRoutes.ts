import { Router } from "express";
import { 
    fetchAllUsers, 
    createUserController,
    userLogin  } 
from "../controllers/userControllers";
import { loginDataValidation } from "../middlewares/joiValidation";
const userRoutes = Router();

userRoutes.get("/", fetchAllUsers);
userRoutes.post('/login',loginDataValidation,userLogin);
userRoutes.post("/register", createUserController);


export default userRoutes;
