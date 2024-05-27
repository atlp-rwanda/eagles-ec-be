
import Message from "../sequelize/models/messages";

export const newChatMessages = async(message:any) => {
    try {
      const chat = {
        sender: message.sender,
        userId: message.userId,
        message: message.message,
        isPrivate: false,
        privateChatId: undefined
      }
      
      const newMessage =   await Message.create(chat);
      if(!newMessage){
        return false;
      }else{
        return newMessage;
      }
    } catch (error:any) {
        throw new Error(error.message);
    };
};

export const pastMessages = async() =>{
    try {
      const currentMessages =  await Message.findAll({where: {isPrivate: false}});
        if(!currentMessages){
            return false;
        }else{
            return currentMessages;
          }
        } catch (error:any) {
            throw new Error(error.message);
       };
};