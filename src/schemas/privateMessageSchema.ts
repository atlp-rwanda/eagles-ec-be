import Joi from "joi";

export const PrivateMessageSchema= Joi.object({
 
 receiverId: Joi.number()
 .required(),
 message:Joi.string()
 .min(1)
 .required(),
}).options({allowUnknown:false})

export const UserToUserPrivateMessageSchema = Joi.object({
    receiverId: Joi.number()
    .required(),
}).options({allowUnknown:false})