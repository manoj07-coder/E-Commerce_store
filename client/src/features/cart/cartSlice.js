import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios.js";

export const fetchCart = createAsyncThunk("cart/fetch", async (_, thunkAPI) => {
  try {
    const res = await api.get("/cart");
    console.log("Cart response: ", res.data);

    return res.data.data;
  } catch (error) {
    console.error("Cart fetch error: ", error.response?.data || error.message);
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

const CartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    status: "idle",
    checkOutUrl: null,
    error: null,
  },
  reducers: {
    clearCart(state) {
      state.items = [];
      state.checkOutUrl = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.status = "succeeded";
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { clearCart } = CartSlice.actions;

export default CartSlice.reducer;
