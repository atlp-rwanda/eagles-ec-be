import { Server as SocketIOServer, Socket } from "socket.io";
import NotificationEmitter from "./emmiter";
import { INotification } from "../sequelize/models/Notification";
import { IUser } from "../types";
import { passwordEventEmitter } from "../jobs/isPasswordExpired";
import { wishAttributes } from "../sequelize/models/wishes";

class EventHandler {
  public io: SocketIOServer;
  public notificationEmitter: NotificationEmitter;

  constructor(io: SocketIOServer, notificationEmitter: NotificationEmitter) {
    this.io = io;
    this.notificationEmitter = notificationEmitter;
    this.initialize();
  }

  private initialize() {
    this.io.on("connection", (socket: Socket) => {
      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
      });

      socket.on("joinRoom", (userId: string) => {
        socket.join(userId);
        console.log(`Joined room: ${userId}`);
      });
    });
    this.notificationEmitter.on("deleted", (data: INotification) => {
      this.io.to(`${data.userId}`).emit("notification", data);
    });

    this.notificationEmitter.on("expired", (data: INotification) => {
      this.io.to(`${data.userId}`).emit("notification", data);
    });

    this.notificationEmitter.on("updated", (data: INotification) => {
      this.io.to(`${data.userId}`).emit("notification", data);
    });

    this.notificationEmitter.on("created", (data: INotification) => {
      this.io.to(`${data.userId}`).emit("notification", data);
    });

    this.notificationEmitter.on("notifications", (data: INotification[]) => {
      this.io.to(`${data[0].userId}`).emit("notifications", data);
    });

    this.notificationEmitter.on("wishlist", (data: INotification) => {
      this.io.to(`${data.userId}`).emit("notification", data);
    });
    this.notificationEmitter.on("new order", (data: INotification) => {
      this.io.to(`${data.userId}`).emit("notification", data);
    });
    this.notificationEmitter.on("order updated", (data: INotification) => {
      this.io.to(`${data.userId}`).emit("notification", data);
    });

    passwordEventEmitter.on("password expired", (data: IUser) => {
      this.io.to(`${data.id}`).emit("password expired", data);
    });
  }
}

export default EventHandler;
