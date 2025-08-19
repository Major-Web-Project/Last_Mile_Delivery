import express from "express";
import { addOrder, getOrder } from "../controllers/order.js";

const router = express.Router();

router.post("/order", addOrder);
router.get("/order", getOrder);

export default router;
