export const productSchema = {
  properties: {
    type: "object",
    name: {
      type: "string",
    },
    description: {
      type: "string",
    },
    stockQuantity: {
      type: "number",
    },
    price: {
      type: "float",
    },
    discount: {
      type: "float",
    },
    categoryID: {
      type: "string",
    },
    expiryDate: {
      type: "date",
    },
  },
};

export const getProducts = {
  tags: ["Products"],
  security: [{ bearerAuth: [] }],
  summary: "Get all products",
  responses: {
    200: {
      description: "OK",
    },
  },
};

export const getSingleProducts = {
  tags: ["Products"],
  security: [{ bearerAuth: [] }],
  summary: "Get single product",
  parameters: [
    {
      in: "path",
      name: "id",
      description: "ID of the product",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  responses: {
    200: {
      description: "OK",
    },
  },
};

export const addProducts = {
  tags: ["Products"],
  security: [{ bearerAuth: [] }],
  summary: "Add new product",
  requestBody: {
    required: true,
    content: {
      "multipart/form-data": {
        schema: {
          type: "object",
          properties: {
            name: { type: "string", example: "" },
            description: { type: "string" },
            images: {
              type: "array",
              items: { type: "string", format: "binary" },
            },
            stockQuantity: { type: "number", example: "" },
            price: { type: "float", example: "" },
            discount: { type: "float", example: "" },
            categoryID: { type: "string", example: "" },
            expiryDate: { type: "date", example: "" },
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: "Created",
    },
    400: {
      description: "Bad request",
    },
  },
};

export const updateProducts = {
  tags: ["Products"],
  security: [{ bearerAuth: [] }],
  summary: " update product",
  parameters: [
    {
      in: "path",
      name: "id",
      description: "ID of the product to update",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  requestBody: {
    required: false,
    content: {
      "multipart/form-data": {
        schema: {
          type: "object",
          properties: {
            name: { type: "string", example: "" },
            images: {
              type: "array",
              items: { type: "string", format: "binary" },
            },
            stockQuantity: { type: "number", example: "" },
            price: { type: "float", example: "" },
            discount: { type: "float", example: "" },
            categoryID: { type: "string", example: "" },
            expiryDate: { type: "date", example: "" },
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: "Updated",
    },
    400: {
      description: "Bad request",
    },
  },
};
export const deleteProducts = {
  tags: ["Products"],
  security: [{ bearerAuth: [] }],
  summary: "Delete product",
  parameters: [
    {
      in: "path",
      name: "id",
      description: "ID of the category to delete",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  responses: {
    200: {
      description: "Deleted",
    },
  },
};

export const searchProduct = {
  tags: ["Products"],
  security: [{ bearerAuth: [] }],
  summary: "Search products",
  parameters: [
    {
      name: "name",
      in: "query",
      description: "Search for products by name",

      schema: {
        type: "string",
      },
    },
    {
      name: "minPrice",
      in: "query",
      description: "Minimum price of product",
      schema: {
        type: "number",
      },
    },
    {
      name: "maxPrice",
      in: "query",
      description: "Maximum price of product",
      schema: {
        type: "number",
      },
    },
    {
      name: "category",
      in: "query",
      description: "Search for products by category",
      schema: {
        type: "string",
      },
    },
    {
      name: "expirationDate",
      in: "query",
      description: "Search expired products",
      schema: {
        type: "date",
      },
    },
  ],
  responses: {
    "200": {
      description: "Successful response",
    },
  },
  "404": {
    description: "No products found",
  },
};

export const changeProductAvailability = {
  tags: ["Products"],
  security: [{ bearerAuth: [] }],
  summary: "change product availability status",
  parameters: [
    {
      in: "path",
      name: "id",
      required: true,
      schema: {
        type: "string",
      },
      description: "ID of the product to change",
    },
  ],
  responses: {
    200: {
      description: "OK - product availability changed successfully",
    },
    404: {
      description: "Not Found - product not found",
    },
    500: {
      description: "Internal Server Error",
    },
  },
};

export const getAdProducts = {
  tags: ["Products"],
  security: [{ bearerAuth: [] }],
  summary: "Fetch ads from aliexpress",
  description: "This endpoint fetches advertisements based on a query parameter. If no query is provided, it defaults to 'electronics'.",
  parameters: [
    {
      name: "query",
      in: "query",
      required: false,
      description: "The search query for fetching ads.",
      schema: {
        type: "string",
        example: "Electronics",
      },
    },
  ],
  responses: {
    200: {
      description: "Success",
    },
    404: {
      description: "Not Found",
    },
    500: {
      description: "Internal Server Error",
    },
  },
};
