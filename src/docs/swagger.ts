import express from "express";
import { serve, setup } from "swagger-ui-express";
import { env } from "../utils/env";
import {
  createUsers,
  getUsers,
  loginAsUser,
  userSchema,
  loginSchema,
  updatePasswordSchema,
  passwordUpdate,
  getProfileUser,
  profileSchema,
  updateProfile,
  verifyOTPToken,
  updateUserRole,
  changeUserAccountStatus,
  logUserOut,
  sendResetLink,
  updateForgotPassword,
  verifyUserAccessToken,
  verifyUserEmail,
  getUser
} from "./users";
import {
  getProducts,
  addProducts,
  updateProducts,
  getSingleProducts,
  deleteProducts,
  productSchema,
  searchProduct,
  changeProductAvailability,
} from "./products";
import { getCategories, addCategories, getSingleCategory, updateCategories, deleteCategories, categorySchema } from "./categories";
import { RoleSchema, getRoles, createRole, updateRole, deleteRole } from "./roledoc";
import { AddToWishes, deleteWish, getWishes, getWishesByProduct, wishSchema } from "./wishes";
import { addItemToCartDoc, clearAllProductFromCartDoc, removeProductFromCartDoc, updateProductQuantityDoc, viewCartDoc } from "./cart";
import { getAllNotifications, readNotification } from "./notifications";
import { homepage } from "./home";
import { payment } from "./payments";
import { createReviewProduct, deleteReview, getReviewProduct, reviewSchema, updateReviewProduct } from "./reviews";
import { getAdProducts } from "./products";
import {PrivateChatSchema, getAllUserPrivateChats, getUserToUserPrivateMessages, createPrivateChat } from "./privateChatDoc"
import { StatusSchema, buyerAndSellerOrder, statusUpdate } from "./orders";
import { getSellerStats } from "./stats";

const docRouter = express.Router();

const options = {
  openapi: "3.0.1",
  info: {
    title: "Eagles E-commerce API",
    version: "1.0.0",
    description: "Documentation for Eagles E-commerce Backend",
  },

  servers: [
    {
      url: `http://localhost:${env.port}`,
      description: "Development server",
    },
    {
      url: "https://eagles-ec-be-production.up.railway.app/",
      description: "Production server",
    },
  ],

  basePath: "/",

  tags: [
    { name: "Home" },
    { name: "Users", description: "Endpoints related to users" },
    {
      name: "Roles",
      description: "Endpoints related to roles",
    },
    { name: "Products", description: "Endpoints related to products" },
    { name: "Categories", description: "Endpoints related categories" },
    { name: "Wishes", description: "Endpoints related to Wishes" },
    { name: "Carts", description: "Endpoints related to Cart" },
    { name: "Payments", description: "Endpoints related to payments" },
    { name: "PrivateChat", description: "Endpoints related to Private Chat" },
    {name: "orders", description: "Endpoints related to orders"},
    {name: "stats", description: "Endpoints related to Seller statistics"}
  ],

  paths: {
    "/": {
      get: homepage,
    },
    "/api/v1/users": {
      get: getUsers,
    },
    "/api/v1/users/register": {
      post: createUsers,
    },
    "/api/v1/users/login": {
      post: loginAsUser,
    },
    "/api/v1/users/logout": {
      post: logUserOut,
    },
    "/api/v1/users/passwordupdate": {
      put: passwordUpdate,
    },
    "/api/v1/users/profile": {
      get: getProfileUser,
      patch: updateProfile,
    },
    "/api/v1/users/2fa-verify": {
      post: verifyOTPToken,
    },
    "/api/v1/users/password-reset-link": {
      post: sendResetLink,
    },
    "/api/v1/users/reset-password": {
      patch: updateForgotPassword,
    },
    "/api/v1/users/verify-user-email": {
      post: verifyUserEmail,
    },

    "/api/v1/users/me": {
      get: getUser,
    },
    "/api/v1/roles": {
      get: getRoles,
      post: createRole,
    },
    "/api/v1/roles/{id}": {
      patch: updateRole,
      delete: deleteRole,
    },
    "/api/v1/users/{id}/role": {
      patch: updateUserRole,
    },
    "/api/v1/products": {
      get: getProducts,
      post: addProducts,
    },
    "/api/v1/products/{id}": {
      get: getSingleProducts,
      patch: updateProducts,
      delete: deleteProducts,
    },
    "/api/v1/products/ads": {
      get: getAdProducts,
    },
    "/api/v1/categories": {
      get: getCategories,
      post: addCategories,
    },
    "/api/v1/categories/{id}": {
      get: getSingleCategory,
      patch: updateCategories,
      delete: deleteCategories,
    },
    "/api/v1/users/{userId}/status": {
      patch: changeUserAccountStatus,
    },
    "/api/v1/wishes": {
      post: AddToWishes,
      get: getWishes,
    },
    "/api/v1/products/{id}/status": {
      patch: changeProductAvailability,
    },
    "/api/v1/products/{id}/wishes": {
      get: getWishesByProduct,
      delete: deleteWish,
    },
    "/api/v1/products/search": {
      get: searchProduct,
    },
    "/api/v1/carts": {
      get: viewCartDoc,
      post: addItemToCartDoc,
      delete: clearAllProductFromCartDoc,
      put: removeProductFromCartDoc,
      patch: updateProductQuantityDoc,
    },
    "/api/v1/notifications": {
      get: getAllNotifications,
    },
    "/api/v1/notifications/{id}": {
      get: readNotification,
    },
    "/api/v1/payment/checkout": {
      post: payment,
    },
    "/api/v1/products/{pid}/reviews": {
      get: getReviewProduct,
      post: createReviewProduct,
      patch: updateReviewProduct,
      delete: deleteReview,
    },
    "/api/v1/chats/private": {
      get: getAllUserPrivateChats,
    },
    "/api/v1/chats/private/{id}": {
      post: createPrivateChat,
      get: getUserToUserPrivateMessages,
    },
      "/api/v1/orders": {
        get: buyerAndSellerOrder
      },
      "/api/v1/orders/{id}/status": {
        patch: statusUpdate
      },
      "/api/v1/stats":{
        get: getSellerStats
      }
  },
  components: {
    schemas: {
      Role: RoleSchema,
      User: userSchema,
      Login: loginSchema,
      updatePassword: updatePasswordSchema,
      Profile: profileSchema,
      Product: productSchema,
      Category: categorySchema,
      Wish: wishSchema,
      Review: reviewSchema,
      PrivateChat: PrivateChatSchema,
      status: StatusSchema
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        in: "header",
        name: "Authorization",
      },
    },
  },
};
docRouter.use("/", serve, setup(options));

export default docRouter;
