import Joi from "joi";
import { Request,Response,NextFunction } from "express";
import { dataValidation } from "../helpers/validation";
  const loginValidation:any = Joi.object({
        email:Joi.string().email().trim(true).required(),
        password:Joi.string().min(8).trim(true).required(),
    }).options({ abortEarly: false });

export const loginDataValidation = async(req:Request,res:Response,next:NextFunction) =>{
   await dataValidation(req,res,next,loginValidation);
};
