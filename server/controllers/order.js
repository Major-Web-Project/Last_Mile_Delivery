import dotenv from "dotenv";
dotenv.config();

import Order from "../models/order.js";
import { Client } from "@googlemaps/google-maps-services-js";
import stock from "../stock/data.js";

const googleMapsClient = new Client({});
const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

export const addOrder = async (req, res) => {
  try {
    const { address, name, phone } = req.body;

    if (!address || !name || !phone) {
      return res
        .status(400)
        .json({ message: "Address, name, and phone are required" });
    }

    const geoResponse = await googleMapsClient.geocode({
      params: {
        address,
        key: googleMapsApiKey,
      },
    });

    if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
      return res.status(400).json({ message: "Could not geocode the address" });
    }

    const location = geoResponse.data.results[0].geometry.location;
    const geometry = {
      type: "Point",
      coordinates: [location.lng, location.lat],
    };

    const newOrder = new Order({
      geometry,
      address,
      name,
      phone,
    });

    await newOrder.save();
    res
      .status(201)
      .json({ message: "Order added successfully", data: newOrder });
  } catch (error) {
    console.error("Error adding order:", error);
    res.status(500).json({ message: "Failed to add order" });
  }
};

export const getOrder = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("geometry");
    console.log(orders);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to retrieve orders" });
  }
};

export const addStockData = async (req, res) => {
  try {
    await Order.deleteMany({});

    await Order.insertMany(stock);
    res.status(200).json({ message: "Stock data added successfully" });
  } catch (error) {
    console.error("Error adding stock data:", error);
    res.status(500).json({ message: "Failed to add stock data" });
  }
};
