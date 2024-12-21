import { Server } from "socket.io";
import { updateGrid, getGridState } from "../services/gridService";
import { saveGridUpdate, getGridHistory } from "../models/gridHistory";

let playersOnline = 0; // Track online players
const playerCooldowns: Record<string, number> = {}; // Cooldown tracker

const socketHandler = (io: Server) => {
    io.on("connection", (socket) => {
        // Increment playersOnline and log connection
        playersOnline = Math.max(playersOnline + 1, 0); // Prevent invalid negative numbers
        console.log(`Player connected: ${socket.id}. Players online: ${playersOnline}`);

        // Broadcast the updated players count
        io.emit("players-online", playersOnline);

        socket.on("update-block", ({ row, col, char }) => {
            const now = Date.now();
            const lastUpdate = playerCooldowns[socket.id] || 0;

            if (now - lastUpdate < 60000) {
                socket.emit("update-error", "You must wait 1 minute before updating again!");
                return;
            }

            playerCooldowns[socket.id] = now; // Update cooldown
            updateGrid(row, col, char);
            saveGridUpdate(row, col, char);

            // Broadcast updates to all players
            io.emit("grid-update", { grid: getGridState() });
            io.emit("grid-history", getGridHistory());
        });

        socket.on("disconnect", () => {
            // Decrement playersOnline and log disconnection
            playersOnline = Math.max(playersOnline - 1, 0); // Prevent invalid negative numbers
            console.log(`Player disconnected: ${socket.id}. Players online: ${playersOnline}`);

            // Broadcast the updated players count
            io.emit("players-online", playersOnline);

            // Clean up cooldown tracker
            delete playerCooldowns[socket.id];
        });
    });
};

export default socketHandler;
