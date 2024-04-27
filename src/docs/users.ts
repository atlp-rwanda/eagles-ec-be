export const userSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    username: {
      type: "string",
    },
    email: {
      type: "string",
      format: "email",
    },
    password: {
      type: "string",
    },
  },
};

export const updatePasswordSchema = {
  type: "object",
  properties: {
    oldPassword: {
      type: "string",
    },
    newPassword: {
      type: "string",
    },
    confirmPassword: {
      type: "string",
    }
  }
}

export const loginSchema = {
  properties: {
    email: {
      type: "string",
      format: "email",
    },
    password: {
      type: "string",
    },
  },
};

export const getUsers = {
  tags: ["Users"],
  summary: "Get all users",
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              $ref: "#/components/schemas/User",
            },
          },
        },
      },
    },
  },
};

export const createUsers = {
  tags: ["Users"],
  summary: "Register a new user",
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/User",
        },
      },
    },
  },
  responses: {
    201: {
      description: "Created",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/User",
          },
        },
      },
    },
    400: {
      description: "Bad request",
    },
  },
};

export const loginAsUser = {
  tags: ["Users"],
  summary: "Login as user",
        responses: {
          200: {
            description: "OK",
          }
        }
    };

export const updateUserRole = {
  tags: ["Users"],
  security: [{ bearerAuth: [] }],
  summary: "Update User Role",
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      description: "User ID",
      schema: {
        type: "number",
      },
    },
  ],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            role: {
              type: "string",
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "OK",
    },
    400: {
      description: "Bad Request",
    },
    500:{
      description: "Internal Server Error"
    }
  },

};

export const passwordUpdate = {
  tags: ["Users"],
  security: [{ bearerAuth: [] }],
  summary: "Update Password",
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/updatePassword"
        }
      }
    }
  },
  responses: {
    200: {
      description: "OK",
    },
    400: {
      description: "Bad Request"
    }
  }
}
  
