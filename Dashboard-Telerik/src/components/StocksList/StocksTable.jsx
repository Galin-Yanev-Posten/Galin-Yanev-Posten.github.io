import { useState } from "react";
import MonthlyChart from "../MonthlyChart/MonthlyChart";
import stocksData from "./stocksData.js";

const StocksTable = () => {
  // Initialize with the stock array from stocksData
  const [stocks, setStocks] = useState(stocksData.stock);
  const [selectedStock, setSelectedStock] = useState(null);

  // If you later want to fetch from API, use this effect:
  // useEffect(() => { ...fetch and setStocks... }, []);

  const handleRowClick = (symbol) => {
    const next = selectedStock === symbol ? null : symbol;
    setSelectedStock(next);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* MonthlyChart shows price movement for the selected stock */}
      <MonthlyChart selectedSymbol={selectedStock} />

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