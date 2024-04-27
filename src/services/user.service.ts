import User from "../sequelize/models/users";
import { Role } from "../sequelize/models/roles";
import { hashedPassword } from "../utils/hashPassword";
import { Op } from "sequelize";

export const getAllUsers = async () => {
  try {
    const users = await User.findAll();
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
    });
    if (!user) {
      return false;
    } else {
      return user;
    }
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const createUserService = async (name: string, email: string, username: string, password: string): Promise<User | null> => {
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ email }, { username }],
    },
  });
  if (existingUser) {
    return null;
  }
  const hashPassword = await hashedPassword(password);
  const user = await User.create({
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

export const updateUserPassword = async (user: User, password: string) => {
    user.password = password;
    const update = await user.save;
    return update;
}


export const updateUserRoleService = async (userId: number, newRole: string): Promise<User | null> => {
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error('User not found');
    }
    const roleExist = await Role.findOne({ where: { name: newRole } });
    
    if (!roleExist) {
      throw new Error(`New Role "${newRole}" is not found`);
    }
    else{
      user.role = newRole;
    }

    await user.save();

    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
