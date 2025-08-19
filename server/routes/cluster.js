// In server/routes/cluster.js (create if needed)
import express from "express";
import {
  predictClusters,
  predictClustersFromOrders,
} from "../controllers/cluster.js";

const router = express.Router();

// Client-provided coordinates
router.post("/clusters/predict", predictClusters);

// Cluster all saved orders
router.get("/clusters/predict-from-orders", predictClustersFromOrders);

export default router;
