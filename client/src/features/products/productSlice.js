import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios.js";

export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (params = {}) => {
    const res = await api.get("/products", { params });
    return res.data.data;
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data.data;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    total: 0,
    page: 1,
    limit: 12,
    current: null,
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const payload = action.payload || {};
        state.items = payload.items || {};
        state.total = payload.total || 0;
        state.page = payload.page || 1;
        state.limit = payload.limit || 12;
        state.status = "succeeded";
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchProductById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.current = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchProductById.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default productSlice.reducer;
