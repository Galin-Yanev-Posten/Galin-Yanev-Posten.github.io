import { useState, useEffect } from "react";
import stocksData from "./stocksData.js";

const StocksTable = () => {
  // Initialize with the stock array from stocksData
  const [stocks, setStocks] = useState(stocksData.stock);
  const [selectedStock, setSelectedStock] = useState(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const apiKey = import.meta.env.VITE_API_KEY;
  //     try {
  //       const response = await fetch(
  //         `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=NVDA&apikey=${apiKey}`
  //       );
  //       const data = await response.json();

  //       // Save all categories to localStorage
  //       localStorage.setItem("topStocksData", JSON.stringify(data));

  //       // Set the current category
  //       setStocks(data);
  //       console.log(data);
  //     } catch (err) {
  //       console.error("Error fetching stocks:", err);
  //     }
  //   };

  //   fetchData();
  // }, []);

  const handleRowClick = (symbol) => {
    setSelectedStock(selectedStock === symbol ? null : symbol);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Symbol
              </th>
              <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-6 py-3 border-b text-right text-sm font-semibold text-gray-700">
                Price
              </th>
              <th className="px-6 py-3 border-b text-right text-sm font-semibold text-gray-700">
                Volume
              </th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr
                key={stock.symbol}
                onClick={() => handleRowClick(stock.symbol)}
                className={`cursor-pointer transition-colors ${
                  selectedStock === stock.symbol
                    ? "bg-blue-100 hover:bg-blue-200"
                    : "hover:bg-gray-50"
                }`}
              >
                <td className="px-6 py-4 border-b text-sm font-medium text-gray-900">
                  {stock.symbol}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-700">
                  {stock.symbol}
                </td>
                <td className="px-6 py-4 border-b text-sm text-right text-gray-900">
                  ${Number(stock.price).toFixed(2)}
                </td>
                <td className="px-6 py-4 border-b text-sm text-right text-gray-700">
                  {stock.volume}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StocksTable;
