import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  geometry: {
    type: {
      type: String,
      enum: ["Point"], // only allow GeoJSON Point
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  address: {
    type: String,
    required: true, // making it mandatory based on your data
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String, // keep as string to preserve leading zeros
    required: true,
  },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
