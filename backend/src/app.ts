import { Server } from "socket.io";
import socketHandler from "./sockets/socketHandler";
import gridRoutes from "./routes/gridRoutes";
import express  from "express";
import http from "http";



const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());

// Define Routes
app.use("/api/grid-history", gridRoutes);

// Initialize socket handler for real-time updates
socketHandler(io);

server.listen(3001, () => {
    console.log("Server running on port 3001");
});
