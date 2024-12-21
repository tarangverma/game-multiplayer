import React, { useState, useEffect } from "react";
import { getSocket } from "../hooks/socket";

const Grid: React.FC = () => {
    const [grid, setGrid] = useState<string[][]>(Array(10).fill(null).map(() => Array(10).fill("")));
    const [playersOnline, setPlayersOnline] = useState(0);
    const [canUpdate, setCanUpdate] = useState(true);
    const [timer, setTimer] = useState(0);
    const socket = getSocket(); // Use the shared socket instance

    useEffect(() => {
        socket.on("grid-state", (initialGrid) => setGrid(initialGrid));
        socket.on("grid-update", ({ grid: updatedGrid }) => setGrid(updatedGrid));
        socket.on("update-error", (msg) => alert(msg));
        socket.on("players-online", (count) => setPlayersOnline(count));

        return () => {
            socket.off("grid-state");
            socket.off("grid-update");
            socket.off("update-error");
            socket.off("players-online");
        };
    }, [socket]);

    const handleBlockClick = (row: number, col: number) => {
        if (!canUpdate) {
            alert(`Please wait ${timer} seconds before updating again!`);
            return;
        }

        const char = prompt("Enter a Unicode character:");
        if (char) {
            socket.emit("update-block", { row, col, char });
            startTimer();
        }
    };

    const startTimer = () => {
        setCanUpdate(false);
        setTimer(60);

        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setCanUpdate(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", textAlign: "center" }}>
            <h1 style={{ marginBottom: "10px" }}>Multiplayer Grid</h1>
            <p style={{ marginBottom: "10px" }}>Players Online: {playersOnline}</p>
            {timer > 0 && (
                <p style={{ marginBottom: "20px", color: "red", fontWeight: "bold" }}>
                    Cooldown: {timer} seconds
                </p>
            )}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(10, 50px)",
                    gap: "2px",
                    justifyContent: "center",
                }}
            >
                {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            style={{
                                width: "50px",
                                height: "50px",
                                border: "1px solid black",
                                borderTopWidth:
                                    rowIndex % 3 === 0 && rowIndex !== 0 ? "3px" : "1px",
                                borderLeftWidth:
                                    colIndex % 3 === 0 && colIndex !== 0 ? "3px" : "1px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: canUpdate ? "white" : "#f0f0f0",
                                cursor: canUpdate ? "pointer" : "not-allowed",
                                fontSize: "20px",
                                fontWeight: "bold",
                                color: cell ? "#333" : "#aaa",
                                transition: "background-color 0.3s",
                            }}
                            onClick={() => handleBlockClick(rowIndex, colIndex)}
                        >
                            {cell || ""}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Grid;
