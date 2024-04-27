import express from "express";
import { serve, setup } from "swagger-ui-express";
import { env } from "../utils/env";
import { 
  createUsers, 
  getUsers,
  updateUserRole,
  loginAsUser,
   userSchema,
   loginSchema,
   updatePasswordSchema,
   passwordUpdate
  } from "./users";
  import {
    RoleSchema,
    getRoles,
    createRole,
    updateRole,
    deleteRole
  } from "./role";

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
    {
      name: "Users",
      description: "Endpoints related to users",
    },
    {
      name: "Roles",
      description: "Endpoints related to roles"
    }
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
    "/api/v1/users/passwordupdate": {
      put: passwordUpdate
    },
    "/api/v1/users/{id}/role": {
      patch: updateUserRole
    },
    "/api/v1/roles": {
      get: getRoles,
      post: createRole,
    },
    "/api/v1/roles/{id}": {
      patch: updateRole,
      delete: deleteRole
    }
  },

 



  components: {
    schemas: {
      User: userSchema,
      Login: loginSchema,
      updatePassword: updatePasswordSchema,
      RoleSchema: RoleSchema
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
