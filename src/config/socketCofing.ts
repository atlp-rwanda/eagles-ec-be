import { Server,Socket } from "socket.io";
import { sendMessages, getPastMessages } from "../controllers/chatsController";
import { createAPrivateMessageSocket, retrieveAUserToUserPrivateMessageSocket } from "../controllers/privateChatController";



 const socket = (io: Server): void => {
    let connectedClients: Set<string> = new Set();
    io.on('connection', async(socket: Socket) => {
        connectedClients.add(socket.id);
        io.emit('connected client', connectedClients.size);

        console.log(`connected client`)
        await getPastMessages(socket);
    

        socket.on('disconnect', () => {
            io.emit('removed');
            connectedClients.delete(socket.id);
            io.emit('dis connected client', connectedClients.size);
        });
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

export default socket;