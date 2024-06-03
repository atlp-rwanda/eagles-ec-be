import { 
    createAPrivateMessageController, 
    getAllPrivateChatsController, 
    getUserToUserPrivateMessagesController, privateChat } from "../controllers/privateChatController";
import { isLoggedIn } from "../middlewares/isLoggedIn";

import express from "express";

 const PrivateChatRoutes = express.Router();

PrivateChatRoutes.post('/private/:id',isLoggedIn, createAPrivateMessageController);
PrivateChatRoutes.get('/private', isLoggedIn, getAllPrivateChatsController);
PrivateChatRoutes.get('/private/:id',isLoggedIn, getUserToUserPrivateMessagesController);
PrivateChatRoutes.get('/page', privateChat);

export default  PrivateChatRoutes;