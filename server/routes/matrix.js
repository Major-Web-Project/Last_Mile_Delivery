import express from "express";
import { getMatrix } from "../controllers/matrix.js";

const router = express.Router();

router.get("/matrix", getMatrix);

export default router;
