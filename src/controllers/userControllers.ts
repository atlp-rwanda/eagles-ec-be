import { Request, Response } from "express";
import * as userService from "../services/user.service";
import { generateToken } from "../utils/jsonwebtoken";
import * as mailService from "../services/mail.service";
import { IUser, STATUS, SUBJECTS } from "../types";
import { comparePasswords } from "../utils/comparePassword";
import { createUserService, getUserByEmail, updateUserPassword,loggedInUser } from "../services/user.service";
import { hashedPassword } from "../utils/hashPassword";
import { updateUserRoleService } from "../services/user.service";
import { isSeller } from "../utils/isSeller";

import User from "../sequelize/models/users";
import { Role } from "../sequelize/models/roles";
import Token, { TokenAttributes } from "../sequelize/models/Token";
import { verifyOtpTemplate } from "../email-templates/verifyotp";

export const fetchAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();

    if (users.length <= 0) {
      return res.status(404).json({
        message: "No users found",
      });
    } else {
      res.status(200).json({
        message: "Users fetched successfully",
        count: users.length,
        users: users,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user: IUser = await loggedInUser(email);
  let accessToken;
  if (!user || user === null) {
    res.status(404).json({
      status: 404,
      message: "User Not Found ! Please Register new ancount",
    });
  } else {
    accessToken = await generateToken(user);
    const match = await comparePasswords(password, user.password);
    if (!match) {
      res.status(401).json({
        status: 401,
        message: " User email or password is incorrect!",
      });
    } else {
      // @ts-ignore
      if (user.userRole.name === "seller") {
        const token = Math.floor(Math.random() * 90000 + 10000);
        //@ts-ignore
        await Token.create({ token: token, userId: user.id });
        await mailService.sendEmailService(user, SUBJECTS.CONFIRM_2FA, verifyOtpTemplate(token), token);
        return res.status(200).json({
          status: STATUS.PENDING,
          message: "OTP verification code has been sent ,please use it to verify that it was you",
        });
      } else {
        // delete user.password;
        const userInfo = {
          
          id: user.id,
          email: user.email,
          roleId: user.userRole?.id,
          roleName: user.userRole!.name

        }
        return res.status(200).json({
          status: 200,
          message: "Logged in",
          user: userInfo,
          token: accessToken,
        });
      }
    }
  }
};

export const createUserController = async (req: Request, res: Response) => {
  try {
    const { name, email, username, password } = req.body;
    const user = await createUserService(name, email, username, password);
    if (!user || user == null) {
      return res.status(409).json({
        status: 409,
        message: "User already exists",
      });
    }
    return res.status(201).json({
      status: 201,
      message: "User successfully created."
    });
  } catch (err: any) {
    if (err.name === "UnauthorizedError" && err.message === "User already exists") {
      return res.status(409).json({ error: "User already exists" });
    }
    return res.status(500).json({ error: err });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  try {
    // @ts-ignore
    const { user } = req;
    // @ts-ignore
    const isPasswordValid = await comparePasswords(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirm password do not match" });
    }
    // @ts-ignore
    if (await comparePasswords(newPassword, user.password)) {
      return res.status(400).json({ message: "New password is similar to the old one. Please use a new password" });
    }

    const password = await hashedPassword(newPassword);
    // @ts-ignore
    const update = await updateUserPassword(user, password);
    if(update){
      return res.status(200).json({ message: "Password updated successfully" });
    }
  } catch (err: any) {
    return res.status(500).json({
      message: err.message,
    });
  }
}

export const updateUserRole = async (req: Request, res: Response) => {
  const { roleId } = req.body;
  const userId = parseInt(req.params.id);
  
  try {
    
    const userToUpdate = await updateUserRoleService(userId, roleId);
    

    res.status(200).json({
      message: 'User role updated successfully',
    }
    );
    
    
    
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


export const tokenVerification = async (req: any, res: Response) => {
  const foundToken: TokenAttributes = req.token;

  try {
    const tokenCreationTime = new Date(String(foundToken?.createdAt)).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - tokenCreationTime;

    if (timeDifference > 600000) {
      await Token.destroy({ where: { userId: foundToken.userId } });
      return res.status(401).json({
        message: "Token expired",
      });
    }
// @ts-ignore
    const user: IUser | null = await User.findOne({ where: { id: foundToken.userId } });

    if (user) {
      const token = await generateToken(user);

      await Token.destroy({ where: { userId: foundToken.userId } });

      return res.status(200).json({
        message: "Login successful",
        token,
        user,
      });
    } else {
      return res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const handleSuccess = async (req: Request, res: Response) => {
  // @ts-ignore
  const user: UserProfile = req.user;

  try {
    let token;
    let foundUser: any = await User.findOne({
      where: { email: user.emails[0].value }
    });

    if (!foundUser) {
      //@ts-ignore
      const newUser:IUser = await User.create({
        name: user.displayName,
        email: user.emails[0].value,
        username: user.name.familyName,
        // @ts-ignore
        password: null,
      });
      token = await generateToken(newUser);
      foundUser = newUser;
    } else {
      token = await generateToken(foundUser);
    }

    return res.status(200).json({
      token: token,
      message: 'success'
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
});
}
};


export const handleFailure = async (req: Request, res: Response) => {
  try {
    res.status(401).json({
      message: "unauthorized",
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};
