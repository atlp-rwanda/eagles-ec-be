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
} from "./users";
import { RoleSchema, getRoles, createRole, updateRole, deleteRole } from "./roledoc";
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
import { AddToWishes, deleteWish, getWishes, getWishesByProduct, wishSchema } from "./wishes";
import { joinChats } from "./chats";
import { addItemToCartDoc, clearAllProductFromCartDoc, removeProductFromCartDoc, updateProductQuantityDoc, viewCartDoc } from "./cart";

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
      url: "https://eagles-ec-be-development.onrender.com/",
      description: "Production server",
    },
  ],

  basePath: "/",

  tags: [
    { name: "Users", description: "Endpoints related to users" },
    {
      name: "Roles",
      description: "Endpoints related to roles",
    },
    { name: "Products", description: "Endpoints related to products" },
    { name: "Categories", description: "Endpoints related categories" },
    { name: "Wishes", description: "Endpoints related to Wishes" },
  ],

  paths: {
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
    get: getWishes
  } ,
  "/api/v1/products/{id}/status": {
    patch: changeProductAvailability,
  },
  "/api/v1/messages":{
    get:joinChats
  },
  "/api/v1/products/{id}/wishes": {
    get: getWishesByProduct,
    delete: deleteWish
  },
    "/api/v1/products/search" : {
      get: searchProduct
   },
   "/api/v1/carts": {
    get: viewCartDoc,
    post: addItemToCartDoc,
    delete: clearAllProductFromCartDoc,
    put: removeProductFromCartDoc,
    patch: updateProductQuantityDoc,
  },
 },
 components: {
  schemas: {
    Role: RoleSchema,
    User: userSchema,
    Login: loginSchema,
    updatePassword: updatePasswordSchema,
    Profile: profileSchema,
    Product:productSchema,
    Category:categorySchema,
    Wish: wishSchema
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
}
}
docRouter.use("/", serve, setup(options));

export default docRouter;
