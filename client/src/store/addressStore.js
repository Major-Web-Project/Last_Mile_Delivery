import { create } from "zustand";
import { axiosInstance } from "../lib/utils";

const orderStore = create((set, get) => ({
  orders: [],
  orderCallbacks: [],

  // Add callback function
  addOrderCallback: (callback) => {
    set((state) => ({
      orderCallbacks: [...state.orderCallbacks, callback],
    }));
  },

  // Remove callback function
  removeOrderCallback: (callback) => {
    set((state) => ({
      orderCallbacks: state.orderCallbacks.filter((cb) => cb !== callback),
    }));
  },

  // Notify all callbacks
  notifyOrderCallbacks: () => {
    const { orderCallbacks } = get();
    orderCallbacks.forEach((callback) => callback());
  },

  getOrders: async () => {
    try {
      const response = await axiosInstance.get("/order");
      set({ orders: response.data });
      console.log(response.data);
    } catch (error) {
      console.log(
        "Something went wrong",
        error.response?.data?.message || error.message
      );
    }
  },

  addOrders: async (address) => {
    try {
      const response = await axiosInstance.post("/order", { address });
      console.log("Address added successfully");

      // Refresh orders after adding new one
      await get().getOrders();

      // Notify all callbacks that orders have been updated
      get().notifyOrderCallbacks();

      return {
        success: true,
        data: response.data,
        geocodedAddress: response.data.geocodedAddress,
      };
    } catch (error) {
      console.log(
        "Something went wrong",
        error.response?.data?.message || error.message
      );
      throw new Error(error.response?.data?.message || "Failed to add address");
    }
  },
}));

export default orderStore;
