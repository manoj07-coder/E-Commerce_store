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

export const deleteMyProduct = createAsyncThunk(
  "products/delete",
  async (id) => {
    const res = await api.delete(`/products/${id}`);
    return res.data.data;
  }
);

export const updateMyProduct = createAsyncThunk(
  "products/update",
  async ({ id, data }) => {
    const res = await api.put(`/products/${id}`, data);
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
        const newProduct = action.payload?.product || action.payload;
        if (newProduct) state.items.push(newProduct);
      })
      .addCase(deleteMyProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p._id !== action.payload.id);
      })
      .addCase(updateMyProduct.fulfilled, (state, action) => {
        const updated = action.payload?.product || action.payload;
        if (!updated || !updated._id) return;

        state.items = state.items.map((item) => {
          if (!item) return null;
          return item._id === updated._id ? updated : item;
        });
      });
  },
});

export default myProductSlice.reducer;
