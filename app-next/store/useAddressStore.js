import { create } from "zustand";
import axios from "axios";
import { API_ROUTES } from "@/utils/api";

export const useAddressStore = create((set, get) => ({
  isLoading: false,
  address: [],
  error: null,
  createAddress: async (address) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_ROUTES.ADDRESS}/add-address`,
        address,
        { withCredentials: true }
      );
      console.log(response);
      const newAddress = response.data.address;
      set((state) => ({
        address: [newAddress, state.address],
        isLoading: false,
      }));
      return newAddress;
    } catch (error) {
      set({ isLoading: false, error: error });
    }
  },
  fetchAddress: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_ROUTES.ADDRESS}/get-address`, {
        withCredentials: true,
      });
      set({ address: response.data.addresses, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error });
    }
  },
}));
