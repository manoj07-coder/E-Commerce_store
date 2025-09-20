import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; //localstorage
import authReducer from "../features/auth/authSlice.js";

const rootReducer = combineReducers({
  auth: authReducer,
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
