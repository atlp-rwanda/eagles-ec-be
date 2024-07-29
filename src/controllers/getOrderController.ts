import { Request, Response } from "express";
import { getOrderBuyer, updateOrderStatusService } from "../services/OrderService";
import * as mailService from "../services/mail.service";
import { SUBJECTS, UserId } from "../types";
import { orderStatusTemplate } from "../email-templates/orderStatus";
import Order from "../sequelize/models/orders";
import User from "../sequelize/models/users";
import Notification from "../sequelize/models/Notification";
import { notificationEmitter } from "../utils/server";

export const getOrderController = async (req: Request, res: Response) => {
  try {
    const response = await getOrderBuyer(req, res);
    return res.status(200).json({
      status: 200,
      length: response?.length,
      orders: response?.length === 0 ? "You have not order yet" : response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: `error accured during fetching order ${error}`,
    });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id: userId } = req.user as UserId;
    const { id: orderId } = req.params;
    const { status } = req.body;
    const buyerOrder = await Order.findByPk(orderId);
    const dataValues = await User.findByPk(buyerOrder?.buyerId);

    const updatedItems = await updateOrderStatusService(userId, orderId, status);
    if (updatedItems) {
      // @ts-ignore
      await mailService.sendNotification(
        dataValues?.dataValues.email,
        SUBJECTS.ORDER_STATUS_UPDATED,
        //@ts-ignore
        orderStatusTemplate(dataValues?.dataValues.username, buyerOrder?.id, buyerOrder?.createdAt, status),
      );

      const notification = await Notification.create({
        title: "Order Status updated",
        message: `Dear ${dataValues?.dataValues.username} your  Order ${buyerOrder?.id} status updated to ${status}`,
        //@ts-ignore
        userId: buyerOrder?.buyerId,
      });

      notificationEmitter.emit("order updated", notification.dataValues);

      return res.json({ message: "Order items status updated", updatedItems });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
