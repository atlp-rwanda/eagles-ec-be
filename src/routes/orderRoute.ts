import express from "express"
import { getOrderController, updateOrderStatus,  } from "../controllers/getOrderController";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { isAseller } from "../middlewares/sellerAuth";


const orderRouter = express.Router()

orderRouter.get('/', isLoggedIn,  getOrderController)
orderRouter.patch("/:id/status", isLoggedIn, updateOrderStatus)

export default orderRouter;