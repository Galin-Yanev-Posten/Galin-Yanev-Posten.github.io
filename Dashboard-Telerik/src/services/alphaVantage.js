const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
const BASE_URL = "https://www.alphavantage.co/query";

const TOP_SYMBOLS = ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA", "META", "NVDA", "JPM", "V", "JNJ"];

export const fetchStockQuote = async (symbol) => {
    try {
        const response = await fetch(
            `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
        );
        const data = await response.json();
        return data["Global Quote"] || null;
    } catch (error) {
        console.error(`Error fetching stock ${symbol}:`, error);
        return null;
    }
};

export const fetchMultipleStocks = async (symbols = TOP_SYMBOLS) => {
    const results = await Promise.all(symbols.map(symbol => fetchStockQuote(symbol)));
    return results.filter(stock => stock && stock["01. symbol"]);
};

export const fetchMonthlyData = async (symbol) => {
    try {
        const response = await fetch(
            `${BASE_URL}?function=TIME_SERIES_MONTHLY&symbol=${symbol}&apikey=${API_KEY}`
        );
        const data = await response.json();
        return data["Monthly Time Series"] || null;
    } catch (error) {
        console.error(`Error fetching monthly data for ${symbol}:`, error);
        return null;
    }
};

export const getTopSymbols = () => TOP_SYMBOLS;