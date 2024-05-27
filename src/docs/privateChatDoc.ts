export const PrivateChatSchema = {
    properties: {
        type: "object",
        sender: {
            type: "string",
            required: true,
        },
        receiverId: {
            type: "number",
            required: true,
        },
        message: {
            type: "string",
            required: true,
        },

    },    
   
}

export const createPrivateChat={
    tags: ['PrivateChat'],
    security: [{bearerAuth: []}],
    summary: 'Create a Private Chat or continue messagingin an existing Private Chat',
    parameters: [
        {
            name: 'id',
            in: 'path',
            required: true,
            description: 'receiver Id',
            schema: {
                type: "number"
            },
        }
    ],
    requestBody: {
        required: true,
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message:{
                            type: 'string',
                        },
                        }
                    },
                },
            },
        },
    
    responses: {
        201: {
            description: 'created',
        },
        403: {
            description: 'Forbidden',
        },
        404: {
            description: 'Not found',
        },
    },
};

export const getAllUserPrivateChats={
    tags: ['PrivateChat'],
    security: [{bearerAuth: []}],
    summary: 'Get all Private Chats for a User',
    responses: {
        200: {
            description: 'Success',
        },
        403: {
            description: 'Forbidden',
        },
        404: {
            description: 'Not found',
        },
    },
};


export const getUserToUserPrivateMessages = {
    tags: ['PrivateChat'],
    security: [{bearerAuth: []}],
    summary: 'Get all Private Messages between two users',
    parameters: [
        {
            name: 'id',
            in: 'path',
            required: true,
            description: 'receiver Id',
            schema: {
                type: 'number'
            },
        }
    ],
    responses: {
        200: {
            description: 'Success',
        },
        403: {
            description: 'Forbidden',
        },
        404: {
            description: 'Not found',
        },
    },
};
