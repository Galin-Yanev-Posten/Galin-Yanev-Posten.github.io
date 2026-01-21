import { configureStore } from "@reduxjs/toolkit";
import { alphaVantageApi } from "./alphaVantageApi";

export const store = configureStore({
  reducer: {
    [alphaVantageApi.reducerPath]: alphaVantageApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(alphaVantageApi.middleware),
});
