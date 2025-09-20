import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; //localstorage
import authReducer from "../features/auth/authSlice.js";
import productReducer from "../features/products/productSlice.js";
import cartReducer from "../features/cart/cartSlice.js";
import api from "../api/axios.js";
import { setAuthTokens, logout } from "../features/auth/authSlice.js";
import axios from "axios";

const rootReducer = combineReducers({
  auth: authReducer,
  product: productReducer,
  cart: cartReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "cart"], //persist auth tokens & cart
};

const persisted = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persisted,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state?.auth?.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const state = store.getState();
      const refreshToken = state?.auth?.refreshToken;

      if (!refreshToken) {
        store.dispatch(logout());
        return Promise.reject(err);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = "Bearer " + token;
          return api(originalRequest);
        });
      }

      isRefreshing = true;
      const API_URL = import.meta.env.VITE_API_URL;

      try {
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });
        const {
          accessToken,
          refreshToken: newRefresh,
          user,
        } = response.data?.data || {};
        store.dispatch(
          setAuthTokens({ accessToken, refreshToken: newRefresh, user })
        );
        processQueue(null, accessToken);

        originalRequest.headers.Authorization = "Bearer " + accessToken;
        return api(originalRequest);
      } catch (error) {
        processQueue(error, null);
        store.dispatch(logout());
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  }
);
