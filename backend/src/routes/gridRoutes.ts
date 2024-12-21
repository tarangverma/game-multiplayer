import express from "express";
import { getGridHistory } from "../models/gridHistory";

const router = express.Router();

router.get("/", (req, res) => {
    const history = getGridHistory();
    res.json(history);
});

export default router;
