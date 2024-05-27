import User from "../sequelize/models/users";
import PrivateChat from "../sequelize/models/privateChats";
import Message from "../sequelize/models/messages";
import { findUserById } from "./user.service";  
import {Op} from "sequelize";

export const createPrivateChat = async (userId: number, receiverId: number) => {
    try {
        
        const  [chat, created] = await PrivateChat.findOrCreate({
            where: {
                [Op.or]:
                [
                    {userId: userId, receiverId: receiverId},
                    {userId: receiverId, receiverId: userId}
                ]
            },
            defaults: {userId, receiverId}
        })
        
        let privateChatId = chat.id;

        return privateChatId;
    }
    catch (error) {
        throw new Error(`Error while Creating your Private Chat: ${error}`);
    }
};

export const CreatePrivateMessage = async(message:any) => {
    try{
    
        const reciever = await findUserById(message.receiverId.toString());
        if (!reciever){
            throw new Error("Receiver not found");
        }
        if (message.message.length < 1){
            throw new Error("Empty message found!")
        }
        const privateChatId = await createPrivateChat(message.userId, message.receiverId);
        
        const newMessage = await Message.create({...message, privateChatId, isPrivate: true});
        return newMessage;

    }
    catch(error){
        throw new Error(`Error while Creating your Private Message: ${error}`);
    }
};

export const getAllUserPrivateChats = async(userId: number) => {
    try{
        const userChats = await PrivateChat.findAll({
            where: {
                [Op.or]: [
                    {userId: userId},
                    {receiverId: userId}
                ]},
            include: [
                {
                    model: Message,
                    as: "messages"
                }]
            }
        );
        return userChats
    }
    catch(error){
        throw new Error(`Error while Fetching your Chats: ${error}`);
    }
};

export const getUserToUserPrivateMessages = async (userId: number, receiverId: number) =>{
    try{
        const reciever = await findUserById(receiverId.toString());
        if (!reciever || reciever === null || reciever === undefined){
            throw new Error("Receiver not found");
        }
        const privateChat = await PrivateChat.findOne({where :{userId, receiverId}});
        if (privateChat){
            const PrivateMessages = await Message.findAll({where:{privateChatId: privateChat.id}})

            return PrivateMessages;
        }
        else{
            return [];
        }
    }
    catch (error){
        throw new Error(`Error while Fetching your Messages: ${error}`)
    }
}
