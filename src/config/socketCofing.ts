import { Server,Socket } from "socket.io";
import { sendMessages, getPastMessages } from "../controllers/chatsController";
import { createAPrivateMessageSocket, retrieveAUserToUserPrivateMessageSocket } from "../controllers/privateChatController";


let users = new Map<string, string>();
 const socket = (io: Server): void => {
    let connectedClients: Set<string> = new Set();
    
    io.on('connection', async(socket: Socket) => {
        connectedClients.add(socket.id);
        io.emit('connected client', connectedClients.size);

        console.log(`connected client ${socket.id}`)

        socket.on("private chats", () =>{
        
            let userId = socket.handshake.query.userId as string
            if(userId){
                users.set(userId, socket.id)
                
            }
        })
        socket.on('disconnect', () => {
            io.emit('removed');
            connectedClients.delete(socket.id);
            let userId = socket.handshake.query.userId as string;
            if(userId){
                users.delete(userId);
            }
            io.emit('dis connected client', connectedClients.size);
        });
        
        await getPastMessages(socket);      

       
        socket.on('chat message', async(data: any) => {
            await sendMessages(io, data);
        }); 
        socket.on('private chat message', async(data: any) =>{
            await createAPrivateMessageSocket(socket, data);
        } )
        socket.on('past private messages between two users', async(data:any) =>{

            await retrieveAUserToUserPrivateMessageSocket(socket, data)
        })
    });
     
}

export const getSocketIdOfUser =( userId: string ) =>{
    return users.get(JSON.stringify(userId))
}

export default socket;
