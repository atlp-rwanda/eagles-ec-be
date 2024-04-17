import { Request,Response,NextFunction } from "express";
import jwt,{sign,verify} from "jsonwebtoken";
import { env } from "../utils/env";


export const isLoggedIn = (req:Request,res:Response,next:NextFunction) =>{
    const accessToken = req.headers.authorization?.split(' ')[1];
    if(accessToken){
        jwt.verify(accessToken,`${env.jwt_secret}`,(error:any,user:any) =>{
            if(error){
                return res.status(401).json({message:'Unauthorized! Login first'})
            }else{
                req.body = user;
                next()
            }
        })
    }else{
        return res.status(401).json({message:'Unauthorized! Login first'})  
    }
}