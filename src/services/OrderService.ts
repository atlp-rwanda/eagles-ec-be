// @ts-nocheck
import { Request, Response } from "express";
import OrderItem from "../sequelize/models/orderItems";
import Order from "../sequelize/models/orders";
import User from "../sequelize/models/users";
import Product from "../sequelize/models/products";
import { authStatus } from "../utils/isSellerOrNormalUser";
import { Role } from "../sequelize/models/roles";
import Profile from "../sequelize/models/profiles";

export const getOrderBuyer = async (req: Request, res: Response) => {
  try {
    await authStatus(req, res);
    // @ts-ignore
    const { roleId, id } = req.user;
    const role = await Role.findByPk(roleId);

    if (role?.name === "seller") {
      const products = await Product.findAll({
        where: { userId: id },
      });
      const productIds = products.map((product) => product.id);

      const sellerOrders = await OrderItem.findAll({
        where: { productId: productIds },
        include: [
          {
            model: Order,
            as: "order",
            include: [{ model: User, as: "buyer", include: [{ model: Profile, as: "profile" }] }],
          },
          { model: User, as: "user" },
          { model: Product, as: "product" },
        ],
      });

      const groupedOrders = sellerOrders.reduce((acc, item) => {
        const { orderId } = item;
        if (!acc[orderId]) {
          acc[orderId] = {
            order: item.order,
            products: [],
          };
        }
        acc[orderId].products.push(item);
        return acc;
      }, {});

      return Object.values(groupedOrders);
    } else {
      const buyerOrders = await Order.findAll({
        where: { buyerId: id },
        include: [
          {
            model: OrderItem,
            as: "items",
            include: [{ model: Product, as: "product" }],
          },
          { model: User, as: "buyer", include: [{ model: Profile, as: "profile" }] },
        ],
      });

      const groupedOrders = buyerOrders.map((order) => ({
        order,
        products: order.items,
      }));

      return groupedOrders;
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateOrderStatusService = async (userId: string, orderId: string, status: string) => {
  const user = await User.findByPk(userId);
  if (user?.roleId !== 2) {
    throw new Error("Unauthorized to update order status");
  }

  const orderItems = await OrderItem.findAll({
    where: { orderId },
    include: [
      {
        model: Product,
        as: "product",
        where: { userId },
      },
      {
        model: Order,
        as: "order",
      },
    ],
  });

  if (!orderItems.length) {
    throw new Error("Order items not found or not associated with this seller");
  }

  for (const item of orderItems) {
    item.status = status;

    await item.save();
  }

  return orderItems;
};
