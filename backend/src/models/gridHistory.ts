type GridUpdate = {
    updates: Array<{ row: number; col: number; char: string }>;
    timestamp: Date;
};

let gridHistory: GridUpdate[] = [];
let currentBatch: GridUpdate | null = null;
let batchTimer: NodeJS.Timeout | null = null;

export const getGridHistory = (): GridUpdate[] => gridHistory;

export const saveGridUpdate = (row: number, col: number, char: string): void => {
    const now = new Date();

    if (!currentBatch || (currentBatch && now.getTime() - currentBatch.timestamp.getTime() > 1000)) {
        // Start a new batch if none exists or if the last batch is older than 1 second
        if (currentBatch) {
            gridHistory.push(currentBatch);
        }

        currentBatch = {
            updates: [{ row, col, char }],
            timestamp: now,
        };

        // Clear the batch after 1 second
        if (batchTimer) clearTimeout(batchTimer);
        batchTimer = setTimeout(() => {
            if (currentBatch) {
                gridHistory.push(currentBatch);
                currentBatch = null;
            }
        }, 1000);
    } else {
        // Add to the current batch
        currentBatch.updates.push({ row, col, char });
    }
};
