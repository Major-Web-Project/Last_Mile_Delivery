import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import orderRoutes from "./routes/order.js";
import matrixRoutes from "./routes/matrix.js";
import clusterRoutes from "./routes/cluster.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const allowedOrigins = ["http://localhost:8081", "http://localhost:8080"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

const PORT = process.env.PORT || 5000;

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/clusterOrders");
}

main()
  .then(() => console.log("Connected to db"))
  .catch((err) => console.log(err));

app.use("/api", orderRoutes);
app.use("/api", matrixRoutes);
app.use("/api", clusterRoutes);

app.listen(PORT, () => {
  console.log(`Proxy running at http://localhost:${PORT}`);
});
