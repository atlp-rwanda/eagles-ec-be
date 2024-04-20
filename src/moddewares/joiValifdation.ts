import Joi from "joi";
import { Request,Response,NextFunction } from "express";
    const validation = Joi.object({
        email:Joi.string().email().trim(true).required(),
        password:Joi.string().min(8).trim(true).required(),
    }).options({ abortEarly: false });

export const dataValidation = async(req:Request,res:Response,next:NextFunction) => {
    const {error} = validation.validate(req.body);
    if(error){
       return res.status(406)
        .json({
            status:406,
            mesage:`Error in User Data : ${error.message}`
        })
    }
    const allowedFields = Object.keys(validation.describe().keys);
    const unknownFields = Object.keys(req.body).filter(field => !allowedFields.includes(field));
    if (unknownFields.length > 0) {
        return res.status(406).json({
            status: 406,
            message: `Unknown fields: ${unknownFields.join(", ")}`
        });
    }else{
        next();
    }
}