import * as wishlistService from "../services/wishlist.service";
import { Request, Response } from "express";
import { wishSchema } from "../schemas/wishShema";
import { notificationEmitter } from "../utils/server";
import Notification from "../sequelize/models/Notification";
import { IUser } from "../types";
import Product from "../sequelize/models/products";

export const addToWishes = async (req: Request, res: Response) => {
  //@ts-ignore
  const id = req.user.id;
  const currentUser: IUser = (req as any).user;
  try {
    const { error, value } = wishSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "Error",
        message: error.details[0].message,
      });
    }
    const product = await wishlistService.getProduct(value.productId);
    if (!product) {
      return res.status(404).json({
        message: "product not found",
      });
    }
    const isProdExisting = await wishlistService.getSingleWish(id, value.productId);
    if (isProdExisting) {
      return res.status(409).json({
        message: "product already exists in your wishlist",
      });
    }
    const wish = await wishlistService.addToWishlist(id, value.productId);
    if (wish) {
      const notification = await Notification.create({
        title: "Product Added to Wishlist",
        message: `${currentUser.name} has added your product ${product.name} to his wishlist`,
        userId: wish.sellerId,
      });

      notificationEmitter.emit("wishlist", notification.dataValues);

      return res.status(201).json({
        message: "product was added to your wishlist",
      });
    }
  } catch (err: any) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const getUserWishes = async (req: Request, res: Response) => {
  //@ts-ignore
  const { id, roleId } = req.user;
  try {
    const wishes = await wishlistService.getAllUserWishes(id, roleId);
    if (wishes.length === 0) {
      return res.status(404).json({
        message: "No wishes found",
      });
    } else {
      return res.status(200).json({
        message: "wishes was retrieved successfully",
        wishes,
      });
    }
  } catch (err: any) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const getProductWishes = async (req: Request, res: Response) => {
  const productId = req.params.id;
  try {
    //@ts-ignore
    const product = await wishlistService.checkOwnership(Number(productId), req.user.id);
    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }
    const wishes = await wishlistService.getProductWishes(Number(productId));
    if (wishes.length === 0) {
      return res.status(200).json({
        message: "no wishes were made on this product",
      });
    } else {
      return res.status(200).json({
        message: "success",
        wishes,
      });
    }
  } catch (err: any) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const deleteWish = async (req: Request, res: Response) => {
  //@ts-ignore
  const id = req.user.id;
  const productId = Number(req.params.id);

  const currentUser: IUser = (req as any).user;
  try {
    const isOwner = await wishlistService.getSingleWish(id, productId);
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({
        message: "product not found",
      });
    }
    if (!isOwner) {
      return res.status(404).json({
        message: "product does not exist in your wishes",
      });
    } else {
      await wishlistService.removeProduct(id, productId);

      const notification = await Notification.create({
        title: "Product Removed from Wishlist",
        message: `${currentUser.name} has removed your product ${product?.name} from his wishlist`,
        userId: product.userId,
      });

      notificationEmitter.emit("wishlist", notification.dataValues);

      return res.status(200).json({
        message: "product was removed from your wishes",
      });
    }
  } catch (err: any) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
