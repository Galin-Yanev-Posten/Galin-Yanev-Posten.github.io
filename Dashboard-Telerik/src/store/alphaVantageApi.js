import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_KEY, BASE_URL } from "../services/alphaVantage";

export const alphaVantageApi = createApi({
  reducerPath: "alphaVantageApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getMonthlySeries: builder.query({
      query: (symbol) => ({
        url: "",
        params: {
          function: "TIME_SERIES_MONTHLY",
          symbol,
          apikey: API_KEY,
        },
      }),
    }),
  }),
});

export const { useGetMonthlySeriesQuery } = alphaVantageApi;
