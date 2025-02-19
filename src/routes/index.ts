import { Router } from "express";
import userRoutes from "./userRoutes";
import productsRouter from "./productsRoute";
import categoriesRouter from "./categoriesRoutes";
import wishesRouter from "./wishesRoutes";
import { joinChatRoomRoutes } from "./chatRoutes";
import cartRoutes from "./cartRoutes";
import notificationRoutes from "./notificationRoutes";
import paymentRouter from "./paymentRoutes";
import PrivateChatRoutes from "./privateChatRoutes";
import orderRouter from "./orderRoute";
import statsRouter from "./statsRoutes";
const appROutes = Router();

appROutes.use("/chats", PrivateChatRoutes);
appROutes.use("/users", userRoutes);
appROutes.use("/products", productsRouter);
appROutes.use("/categories", categoriesRouter);
appROutes.use("/", wishesRouter);
appROutes.use("/messages", joinChatRoomRoutes);
appROutes.use("/carts", cartRoutes);
appROutes.use("/notifications", notificationRoutes);
appROutes.use("/payment", paymentRouter);
appROutes.use("/orders", orderRouter)
appROutes.use("/stats", statsRouter);
export default appROutes;
