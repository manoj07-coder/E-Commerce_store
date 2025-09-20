import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios.js";

export const login = createAsyncThunk(
  "auth/login",
  async (payload, thunkAPI) => {
    const res = await api.post("/auth/login", payload);
    return res.data.data;
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (payload, thunkAPI) => {
    const res = await api.post("/auth/register", payload);
    return res.data.data;
  }
);

export const refreshAuth = createAsyncThunk(
  "/auth/refresh",
  async (refreshToken, thunkAPI) => {
    const res = await api.post("/auth/refresh", { refreshToken });
    return res.data.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: null,
    refreshToken: null,
    status: "idle",
  },
  reducers: {
    logout(state) {
      (state.user = null),
        (state.accessToken = null),
        (state.refreshToken = null);
    },
    setAuthTokens(state, action) {
      const { accessToken, refreshToken, user } = action.payload || {};
      if (accessToken) state.accessToken = accessToken;
      if (refreshToken) state.refreshToken = refreshToken;
      if (user) state.user = user;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        (state.accessToken = action.payload.accessToken),
          (state.refreshToken = action.payload.refreshToken),
          (state.user = action.payload.user || null),
          (state.status = "succeeded");
      })
      .addCase(register.fulfilled, (state, action) => {
        (state.accessToken = action.payload.accessToken),
          (state.refreshToken = action.payload.refreshToken),
          (state.user = action.payload.user || null);
      })
      .addCase(refreshAuth.fulfilled, (state, action) => {
        (state.accessToken = action.payload.accessToken),
          (state.refreshToken = action.payload.refreshToken);
      });
  },
});

export const { logout, setAuthTokens } = authSlice.actions;

export default authSlice.reducer;
