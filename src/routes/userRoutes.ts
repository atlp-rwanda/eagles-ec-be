import { Router } from "express";
import { 
    fetchAllUsers, 
    createUserController,
    userLogin,
    updatePassword}
from "../controllers/userControllers";
import { roleUpdateSchema } from "../schemas/roleUpdateSchema";
import {     emailValidation, validateSchema,} from "../middlewares/validator";
import signUpSchema from "../schemas/signUpSchema";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { passwordUpdateSchema } from "../schemas/passwordUpdate";
import  {updateUserRole} from "../controllers/userControllers";
import { isAdmin } from "../middlewares/isAdmin";


const userRoutes = Router();

userRoutes.get("/", fetchAllUsers);
userRoutes.post('/login',userLogin);
userRoutes.post("/register", 
 
 emailValidation, 
 validateSchema(signUpSchema), 
 createUserController
)
userRoutes.put("/passwordupdate", isLoggedIn, validateSchema(passwordUpdateSchema), updatePassword)

userRoutes.post("/register", createUserController)
userRoutes.patch("/:id/role", isLoggedIn, isAdmin, validateSchema(roleUpdateSchema), updateUserRole)

export default userRoutes;
