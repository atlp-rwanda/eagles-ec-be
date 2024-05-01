import User from "../sequelize/models/users";
import { Role } from "../sequelize/models/roles";
import { hashedPassword } from "../utils/hashPassword";
import passport from "passport";
import { Op } from "sequelize";

export const authenticateUser = passport.authenticate("google", {
  scope: ["email", "profile"],
});

export const callbackFn = passport.authenticate("google", {
  successRedirect: "/api/v1/users/auth/google/success",
  failureRedirect: "/api/v1/users/auth/google/failure",
});

export const getAllUsers = async () => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'username', 'email', 'roleId', 'createdAt', 'updatedAt'],
    });
    if (users.length === 0) {
      console.log("no user");
    }
    return users;
  } catch (error: any) {
    console.log(error.message);
    throw new Error(error.message);
  }
};

export const loggedInUser = async (email: string) => {
  try {
    const user: any = await User.findOne({
      where: { email: email },
      include:[{model:Role, as: 'userRole'}],
      attributes: {exclude:['roleId', 'createdAt', 'updatedAt']}
    });
    return user;
  } catch (err: any) {
    throw new Error(err.message);
  }
};
export const createUserService = async (name: string, email: string, username: string, password: string): Promise<User | null> => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return null;
  }
  const hashPassword = await hashedPassword(password);
  
  const  user = await User.create({
      name,
      email,
      username,
      password: hashPassword,
    });
    return user;
  
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const user = await User.findOne({
    where: { email },
  });
  return user;
};

export const findUserById = async (id: string) => {
  try {
    const user = await User.findByPk(id);
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch (error: any) {
    console.log("error seaching user : " + error.message);
    throw new Error(error.message);
  }
};
export const updateUserPassword = async (user: User, password: string) => {
    user.password = password;
    const update = await User.update({ password: password}, { where: { id: user.id}})
    return update;
}


export const updateUserRoleService = async (userId: number, newRoleId: number): Promise<User | null> => {
  try{
    // check if the role exists
    const role = await Role.findOne({where: {id: newRoleId}})
    if (!role){
      throw new Error(`Role with id: ${newRoleId} not found`);
    }
    // update the role of the user 
    const [numberOfAffectedRows, updatedUser] = await User.update(
      {roleId: newRoleId}, 
      {where:{
      id: userId
    }
    ,returning: true,
      });
      
    if (numberOfAffectedRows === 0){
      throw new Error(`User with id: ${userId} not found`)
    }
    

    return updatedUser[0];
  }
  catch(error: any){
    throw new Error(`Error in service ${error.message}`);
  }
  
};
