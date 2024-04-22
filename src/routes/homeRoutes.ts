import { Request, Response, Router } from "express";

const homeRoute = Router();

homeRoute.get("/", (req: Request, res: Response) => {
  try {
    res.status(200).json({
      message: "Api is working 😎",
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});
homeRoute.get("/login", (req: Request, res: Response) => {
  try {
    res.send("<a href='/api/v1/users/login/google'>click to here to Login</a>");
  } catch (error: any) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

export default homeRoute;
