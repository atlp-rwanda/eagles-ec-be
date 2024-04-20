import { Router } from "express";
import { 
    fetchAllUsers, 
    createUserController,
    userLogin  } 
from "../controllers/userControllers";
import { dataValidation } from "../moddewares/joiValifdation";

const userRoutes = Router();

userRoutes.get("/", fetchAllUsers);
userRoutes.post('/login',dataValidation,userLogin);
userRoutes.post("/register", createUserController);


export default userRoutes;
