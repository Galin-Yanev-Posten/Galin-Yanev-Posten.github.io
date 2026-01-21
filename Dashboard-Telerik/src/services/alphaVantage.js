// Recommendation: Keep API config in one place so UI and RTK Query stay consistent.
export const API_KEY =
  import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || import.meta.env.VITE_API_KEY;
export const BASE_URL = "https://www.alphavantage.co/query";

const TOP_SYMBOLS = ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA", "META", "NVDA", "JPM", "V", "JNJ"];

export const getTopSymbols = () => TOP_SYMBOLS;
