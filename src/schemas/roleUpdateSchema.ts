import Joi from "joi";


export const roleUpdateSchema = Joi.object({
    role: Joi.string().min(3).max(20).required()
    }).options({ allowUnknown: false
})
