import express from "express";
import { addOrder, addStockData, getOrder } from "../controllers/order.js";

const router = express.Router();

router.post("/order", addOrder);
router.get("/order", getOrder);
router.post("/order/add-stock", addStockData);

export default router;
