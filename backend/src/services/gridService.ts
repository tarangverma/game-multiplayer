import { saveGridUpdate } from "../models/gridHistory";

const grid: string[][] = Array(10).fill(null).map(() => Array(10).fill(""));

export const updateGrid = (row: number, col: number, char: string) => {
    grid[row][col] = char;
    saveGridUpdate(row, col, char); // Save the update to history
};

export const getGridState = () => {
    return grid;
};
