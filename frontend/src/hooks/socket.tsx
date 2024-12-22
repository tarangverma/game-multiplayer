// src/socket.ts
import { io, Socket } from "socket.io-client";

const URL = "https://game-multiplayer.onrender.com"; // Replace with your backend URL
let socket: Socket;

export const getSocket = (): Socket => {
    if (!socket) {
        socket = io(URL, { transports: ["websocket"] });
    }
    return socket;
};
