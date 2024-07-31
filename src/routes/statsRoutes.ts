import express from "express";

import { getYearlyStats } from "../controllers/statsController";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { isAseller } from "../middlewares/sellerAuth";

const statsRouter = express.Router();

statsRouter.get("/", isLoggedIn, isAseller , getYearlyStats);

export default statsRouter;