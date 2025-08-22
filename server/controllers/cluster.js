// In server/controllers/cluster.js (create if needed)
import axios from "axios";
import Order from "../models/order.js";

const FASTAPI_BASE_URL =
  process.env.FASTAPI_BASE_URL || "http://localhost:8000";

// Client-provided coordinates -> predict with size cap
export const predictClusters = async (req, res) => {
  try {
    const { coordinates, max_points_per_cluster } = req.body || {};
    if (!Array.isArray(coordinates) || coordinates.length === 0) {
      return res
        .status(400)
        .json({ message: "coordinates must be a non-empty array" });
    }

    // Normalize to objects with lon/lat
    const payload = {
      coordinates: coordinates.map((c) =>
        Array.isArray(c) ? { lon: c[0], lat: c[1] } : { lon: c.lon, lat: c.lat }
      ),
      max_points_per_cluster: Number(max_points_per_cluster) || 10,
    };

    const response = await axios.post(`${FASTAPI_BASE_URL}/predict`, payload);
    res.json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Prediction failed", error: error.message });
  }
};

// Cluster from stored orders -> predict-batch with size cap via /predict
export const predictClustersFromOrders = async (req, res) => {
  try {
    const maxPoints = Number(req.query.max) || 10;

    const orders = await Order.find({});
    console.log("Fetched orders:", orders);
    const coords = orders
      .map((o) =>
        Array.isArray(o.geometry?.coordinates) ? o.geometry.coordinates : null
      )
      .filter(Boolean)
      .map(([lon, lat]) => ({ lon, lat }));

    if (coords.length === 0) {
      return res.status(200).json({
        success: true,
        clusters: [],
        total_points: 0,
        total_clusters: 0,
      });
    }

    const response = await axios.post(`${FASTAPI_BASE_URL}/predict`, {
      coordinates: coords,
      max_points_per_cluster: maxPoints,
    });
    const rawResponse = response.data;

    const clusters = rawResponse.clusters.map((cluster) =>
      cluster.coordinates.map((point) => [point.lon, point.lat])
    );

    res.json(clusters);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Prediction from orders failed", error: error.message });
  }
};
