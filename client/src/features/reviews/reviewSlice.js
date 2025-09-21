import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios.js";

export const fetchReviews = createAsyncThunk(
  "reviews/fetch",
  async (productId) => {
    const res = await api.get(`/reviews/product/${productId}`);
    return res.data.data;
  }
);

export const addReview = createAsyncThunk(
  "reviews/add",
  async ({ product, rating, comment }, { dispatch }) => {
    await api.post("/reviews", { product, rating, comment });
    await dispatch(fetchReviews(product));
    return null;
  }
);

export const updateReview = createAsyncThunk(
  "reviews/update",
  async ({ id, product, rating, comment }, { dispatch }) => {
    await api.put(`/reviews/${id}`, { rating, comment });
    await dispatch(fetchReviews(product));
  }
);

export const deleteReview = createAsyncThunk(
  "reviews/delete",
  async ({ id, product }, { dispatch }) => {
    await api.delete(`/reviews/${id}`);
    await dispatch(fetchReviews(product));
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.status = "loading";
      })

      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.status = "succeeded";
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        (state.status = "failed"), (state.error = action.error.message);
      });
  },
});

export default reviewSlice.reducer;
