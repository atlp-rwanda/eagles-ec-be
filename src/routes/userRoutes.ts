import { Router } from "express";
import { fetchAllUsers } from "../controllers/userControllers";

const userRoutes = Router();

userRoutes.get("/", fetchAllUsers);

export default userRoutes;
