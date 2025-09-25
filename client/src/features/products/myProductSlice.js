import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios.js";

export const fetchMyProducts = createAsyncThunk("products/mine", async () => {
  const res = await api.get("/products/mine");
  return res.data.data;
});

export const createMyProduct = createAsyncThunk(
  "products/create",
  async (data) => {
    const res = await api.post("/products", data);
    return res.data.data;
  }
);

const myProductSlice = createSlice({
  name: "myProducts",
  initialState: {
    items: [],
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyProducts.fulfilled, (state, action) => {
        state.items = action.payload || [];
      })
      .addCase(createMyProduct.fulfilled, (state, action) => {
        state.items.push(action.payload.product);
      });
  },
});

export default myProductSlice.reducer;
