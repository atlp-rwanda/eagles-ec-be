import { Router } from "express";
import { 
    fetchAllUsers, 
    createUserController,
    userLogin,
    updatePassword, handleFailure, handleSuccess } 
from "../controllers/userControllers";
import { 
    emailValidation,
    validateSchema,
 } from "../middleware/validator";
import signUpSchema from "../schemas/signUpSchema";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { passwordUpdateSchema } from "../schemas/passwordUpdate";
import * as userService from '../services/user.service'
require("../auth/auth");


const userRoutes = Router();

userRoutes.get("/", fetchAllUsers);
userRoutes.post('/login',userLogin);
userRoutes.post("/register", 
 emailValidation, 
 validateSchema(signUpSchema), 
 createUserController
)
userRoutes.put("/passwordupdate", isLoggedIn, validateSchema(passwordUpdateSchema), updatePassword)

userRoutes.get("/login/google", userService.authenticateUser);
userRoutes.get("/auth/google/callback", userService.callbackFn);
userRoutes.get("/auth/google/success", handleSuccess);
userRoutes.get("/auth/google/failure", handleFailure);

userRoutes.get("/login/google", userService.authenticateUser);
userRoutes.get("/auth/google/callback", userService.callbackFn);
userRoutes.get("/auth/google/success", handleSuccess);
userRoutes.get("/auth/google/failure", handleFailure);



export default userRoutes;
