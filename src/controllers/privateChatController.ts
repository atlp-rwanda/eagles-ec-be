import * as PrivateChatService from '../services/privateChat.service';
import { Socket, Server } from 'socket.io';
import { Request, Response, NextFunction } from 'express';
import { PrivateMessageSchema, UserToUserPrivateMessageSchema } from '../schemas/privateMessageSchema';
import path from 'path';
import { getSocketIdOfUser } from '../config/socketCofing'

export const createAPrivateMessageController = async(req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        // @ts-ignore
        const sender  = req.user.username;
        const message = req.body.message;
        const messageArgs = {
            userId: userId,
            receiverId: parseInt(req.params.id),
            message: message,
            sender
        
        };

        const validated:any = PrivateMessageSchema.validate(messageArgs);

        if (!validated){
            res.status(400).json({message: validated.error.message});
        }

        const newMessage = await PrivateChatService.CreatePrivateMessage(messageArgs);

        if(!newMessage){
            res.status(400).json({message: "Error while creating your message"});
        }
        res.status(201).json(newMessage);
        next();
    }
    catch (error) {
        res.status(400).json({message: `${error}`});
    }
};

export const createAPrivateMessageSocket= async(socket: Socket, data:any) =>{
    if (!data.message || data.message.trim() === '') {
        socket.emit('validation error', { message: 'Empty message found' });
        return;
    }
    const message= {
        userId: data.userId,
        sender: data.sender,
        receiverId: data.receiverId,
        message: data.message
    }

    const validated: any = PrivateMessageSchema.validate(message)
   
    if (!validated){
        socket.emit('validation error', { message: validated.error.message });
    }
    else{
        const sentPrivateMessage = await PrivateChatService.CreatePrivateMessage(message)
        let receiverId = message.receiverId
        let userId = message.userId
        socket.emit('private message sent', {sentPrivateMessage, userId, receiverId} )
        const recieverSocketId = getSocketIdOfUser(receiverId);
        if(recieverSocketId){
            socket.to(recieverSocketId).emit('private message recieved', sentPrivateMessage)
        }
        
        
    }  

}

// getting all private chats a sender have with other users (those where He might be a receiver or a sender)

export const getAllPrivateChatsController = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const userId = (req as any).user.id;
        const userChats = await PrivateChatService.getAllUserPrivateChats(userId);
        if(!userChats){
            res.status(400).json({message: "Error while fetching your chats"});
        }
        res.status(200).json(userChats);
        next();
    }
    catch(error){

        res.status(400).json({message: "Error while fetching your chats"});
    }
   }


// getting all Private Messages between two user ( a sender and an other user)
export const getUserToUserPrivateMessagesController = async(req: Request, res: Response, next: NextFunction) => {
    try{
        // @ts-ignore
        const userId = req.user.id;
        const receiverId = parseInt(req.params.id);

        const validated:any = UserToUserPrivateMessageSchema.validate([userId, receiverId]);
        const userMessages = await PrivateChatService.getUserToUserPrivateMessages(userId, receiverId);
        if(!userMessages){
            res.status(400).json({message: "Error while fetching your messages"});
        }
        res.status(200).json(userMessages);
        next();
    }
    catch(error){
        res.status(400).json({message: `${error}`});
    }
};

export const retrieveAUserToUserPrivateMessageSocket = async(socket:Socket, data:any) =>{
    const receiverId = data.receiverId;
    const userId = data.userId;

    const validated:any = UserToUserPrivateMessageSchema.validate({userId, receiverId});
    if (!validated){
        socket.emit('validation error', { message: validated.error.message });
    }
    else{
        const userMessages = await PrivateChatService.getUserToUserPrivateMessages(userId, receiverId);
        socket.emit('past private user to user message sent', userMessages )
    }  
}

export const privateChat = async(req:Request,res:Response) => {
    res.sendFile(path.resolve('public/private.html'))
}