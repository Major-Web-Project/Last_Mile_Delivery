import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  address: {
    type: String, // Store text address
    required: false, // or true if mandatory
  },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
