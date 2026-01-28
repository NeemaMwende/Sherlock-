import { Server } from "socket.io";
import { runRag } from "@/lib/rag";

let io: Server | null = null;

export async function GET(req: Request) {
    if (!io) {
        io = new Server({
            path: "/api/socket",
            cors: { origin: "*" },
        });

        io.on("connection", (socket) => {
            console.log("Client connected:", socket.id);

            socket.on("user:typing", () => {
                socket.broadcast.emit("user:typing");
            });

            socket.on("chat:message", async (message: string) => {
                socket.broadcast.emit("bot:typing");

                try {
                    const reply = await runRag(message);
                    socket.emit("chat:reply", reply);
                } catch (e) {
                    console.error("Error in chat:message handler:", e);
                    socket.emit("chat:reply", "Sorry, something went wrong");
                }
            });

            socket.on("disconnect", () => {
                console.log("Client disconnected:", socket.id);
            });
        });
    }

    return new Response("Socket.IO server running", { status: 200 });
}