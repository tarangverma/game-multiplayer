// src/socket.ts
import { io, Socket } from "socket.io-client";

const URL = "http://localhost:3001"; // Replace with your backend URL
let socket: Socket;

export const getSocket = (): Socket => {
    if (!socket) {
        socket = io(URL, { transports: ["websocket"] });
    }
    return socket;
};
