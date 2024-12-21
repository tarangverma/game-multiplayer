import React, { useEffect, useState } from "react";
import { getSocket } from "../hooks/socket";

type GridUpdate = {
    updates: Array<{ row: number; col: number; char: string }>;
    timestamp: string;
};

const History: React.FC = () => {
    const [history, setHistory] = useState<GridUpdate[]>([]);
    const socket = getSocket(); // Use the shared socket instance

    useEffect(() => {
        socket.on("grid-history", (updates: GridUpdate[]) => {
            setHistory(updates);
        });

        return () => {
            socket.off("grid-history");
        };
    }, [socket]);

    return (
        <div>
            <h2>Update History</h2>
            <ul>
                {history.map((batch, index) => (
                    <li key={index}>
                        <strong>{new Date(batch.timestamp).toLocaleString()}</strong>
                        <ul>
                            {batch.updates.map((update, idx) => (
                                <li key={idx}>
                                    {`Row: ${update.row}, Col: ${update.col}, Char: ${update.char}`}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default History;
