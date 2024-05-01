import { Router } from "express";
import { 
    fetchAllUsers, 
    createUserController,
    userLogin,
    updatePassword,
    handleFailure,
    handleSuccess,
    tokenVerification
}
from "../controllers/userControllers";
import { roleUpdateSchema } from "../schemas/roleUpdateSchema";
import {    emailValidation, validateSchema,} from "../middlewares/validator";
import signUpSchema from "../schemas/signUpSchema";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { passwordUpdateSchema } from "../schemas/passwordUpdate";
import  {updateUserRole} from "../controllers/userControllers";
import { isAdmin } from "../middlewares/isAdmin";
import { isTokenFound } from "../middlewares/isTokenFound";
import { authenticateUser, callbackFn } from "../services/user.service";
require("../auth/auth");
import logInSchema from "../schemas/loginSchema";

const userRoutes = Router();

userRoutes.get("/", fetchAllUsers);
userRoutes.post('/login',userLogin);
userRoutes.post("/register", 
 
 emailValidation, 
 validateSchema(signUpSchema), 
 createUserController
)
userRoutes.put("/passwordupdate", isLoggedIn, validateSchema(passwordUpdateSchema), updatePassword)
userRoutes.post("/login", emailValidation,validateSchema(logInSchema),userLogin);
userRoutes.post("/register", emailValidation, validateSchema(signUpSchema), createUserController);
userRoutes.put("/passwordupdate", isLoggedIn, validateSchema(passwordUpdateSchema), updatePassword);
userRoutes.post("/2fa-verify", isTokenFound, tokenVerification);

userRoutes.get("/auth/google", authenticateUser);
userRoutes.get("/auth/google/callback", callbackFn);
userRoutes.get("/auth/google/success", handleSuccess);
userRoutes.get("/auth/google/failure", handleFailure);

userRoutes.post("/register", createUserController)
userRoutes.patch("/:id/role", isLoggedIn, isAdmin, validateSchema(roleUpdateSchema), updateUserRole)

export default userRoutes;
