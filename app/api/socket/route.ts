import { Server } from "socket.io";
import { runRag } from "@/lib/rag"

export async function GET(reqq: Request){
    if (!io) {
        io = new Server({
            path: "/api/socket",
            cors: { origin: "*"},
        });

        io.on("connection", (socket) => {
            console.log("client connected");

            socket.on("user:typing", ()=> {
                socket.broadcast.emit("user:typing")
            })

            socket.on("chat:message", async (message: string) => {
                socket.broadcast.emi("bot:typing");
            
            
                try{
                    socket.emit("chat:reply", reply)
                }catch(e){
                    socket.emit("chat:reply", "Sorry something went wrong")
                }
            });
        });

    }

    return new Response("socket running");
}