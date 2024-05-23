import express from "express";
import cors from "cors";

import { createServer, Server as HTTPServer } from "http";
import path from "path";
import { Server as SocketIOServer } from "socket.io";
import socket from "../config/socketCofing";
import { isPasswordExpired } from "../jobs/isPasswordExpired";

import appROutes from "../routes";
import homeRoute from "../routes/homeRoutes";
import docRouter from "../docs/swagger";
import passport from "passport";
import session from "express-session";
import RoleRouter from "../routes/roleRoutes";
import NotificationEmitter from "../events/emmiter";
import EventHandler from "../events/handler";
import { findExpiredProduct } from "../jobs/cron";
import { env } from "./env";

const app = express();

const server: HTTPServer = createServer(app);
export const io: SocketIOServer = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
    credentials: true,
  },
});

export const notificationEmitter = new NotificationEmitter(io); 
const eventHandler = new EventHandler(io, notificationEmitter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin:env.client_url,
  }),
);

app.use(
  session({
    secret: "eagles.team1",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/chats", express.static(path.join(__dirname, '../../public')));

app.use("/", homeRoute);
app.use("/api/v1", appROutes);
app.use("/docs", docRouter);
app.use("/api/v1/roles", RoleRouter);

socket(io);
findExpiredProduct()

isPasswordExpired();
export default server;
