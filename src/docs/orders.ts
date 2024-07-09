import { required } from "joi";

export const StatusSchema = {
  type: "object",
  properties: {
    status: {
      type: "string",
    },
  },
};

export const buyerAndSellerOrder = {
  tags: ["orders"],
  security: [{ bearerAuth: [] }],
  summary: "Orders for seller and buyers",
  responses: {
    200: {
      description: "Success",
    },
    400: {
      description: "Bad request",
    },
    401: {
      description: "Unauthorized",
    },
    500: {
      description: "Internal server error",
    },
  },
};

export const statusUpdate = {
  tags: ["orders"],
  security: [{ bearerAuth: [] }],
  summary: "Status update for seller",
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      description: "order Id",
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
            status: {
              type: "string",
            },
          },
          required: ["status"],
        },
      },
    },
  },
  responses: {
    201: {
      description: "Upgrade successfully",
    },
    404: {
      description: "Review not found",
    },
    500: {
      description: "Internal server error.",
    },
  },
};
