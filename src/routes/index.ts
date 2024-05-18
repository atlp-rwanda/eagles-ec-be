import { Router } from "express";
import userRoutes from "./userRoutes";
import productsRouter from "./productsRoute";
import categoriesRouter from "./categoriesRoutes";
import wishesRouter from "./wishesRoutes";
import { joinChatRoomRoutes } from "./chatRoutes";
import cartRoutes from "./cartRoutes";
const appROutes = Router();

appROutes.use("/users", userRoutes);
appROutes.use("/products",productsRouter);
appROutes.use('/categories',categoriesRouter);
appROutes.use("/messages",joinChatRoomRoutes)
appROutes.use("/", wishesRouter);
appROutes.use("/carts", cartRoutes);
export default appROutes;
