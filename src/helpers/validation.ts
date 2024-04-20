import { Request,Response,NextFunction } from "express";
export const dataValidation = async(req:Request,res:Response,next:NextFunction,data:any) => {
    const {error} = data.validate(req.body);
    if(error){
       return res.status(406)
        .json({
            status:406,
            mesage:`Error in User Data : ${error.message}`
        })
    }
    const allowedFields = Object.keys(data.describe().keys);
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