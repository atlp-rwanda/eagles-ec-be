import Joi from "joi";
import { loginSchema } from "../docs/users";

export const logInSchema = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).max(20).required(),
}).options({ allowUnknown: false });

export default loginSchema;
