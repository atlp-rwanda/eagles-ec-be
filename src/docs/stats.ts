export const getSellerStats = {
    tags: ["stats"],
    security: [{ bearerAuth: [] }],
    summary: "Get seller statistics",
    responses: {
        200: {
            description: "success",
        },
        401: {
            description: "Unauthorized",
        },
        500: {
            description: "Internal Server Error",
        },
    },
}