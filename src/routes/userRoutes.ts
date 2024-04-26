import { Router } from "express";
import { 
    fetchAllUsers, 
    createUserController,
    userLogin,
    updateUserRole
} 
from "../controllers/userControllers";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { isAdmin } from "../middlewares/isAdmin";

const userRoutes = Router();

userRoutes.get("/", fetchAllUsers);
userRoutes.post('/login',userLogin);
userRoutes.post("/register", createUserController)
userRoutes.patch("/:id/role", isLoggedIn, isAdmin, updateUserRole)

export default userRoutes;
