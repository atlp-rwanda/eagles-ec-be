import { Request, Response } from "express";
import * as userService from "../services/user.service";
import User from "../sequelize/models/user";

export const fetchAllUsers = async (req: Request, res: Response) => {
  try {
    // const users = await userService.getAllUsers();

    const users = await User.findAll();

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
