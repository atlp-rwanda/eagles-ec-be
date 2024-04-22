import { Router } from "express";
import { handleFailure, handleSuccess } from "../controllers/userControllers";
require("../auth/auth");
import * as userService from '../services/user.service'


const googleRoutes = Router();

googleRoutes.get("/auth/google", userService.authenticateUser);
googleRoutes.get("/auth/google/callback", userService.callbackFn);
googleRoutes.get("/auth/google/success", handleSuccess);
googleRoutes.get("/auth/google/failure", handleFailure);

export default googleRoutes;