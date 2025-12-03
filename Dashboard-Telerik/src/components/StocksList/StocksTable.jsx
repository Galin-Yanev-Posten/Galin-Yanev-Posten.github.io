import { useState } from "react";
import MonthlyChart from "../MonthlyChart/MonthlyChart";
import stocksData from "./stocksData.js";

const StocksTable = () => {
  const [stocks, setStocks] = useState(stocksData.stock);
  const [selectedStock, setSelectedStock] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filterText, setFilterText] = useState("");

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getProcessedStocks = () => {
    let processed = [...stocks];

    // Apply filtering
    if (filterText) {
      processed = processed.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(filterText.toLowerCase()) ||
          stock.name?.toLowerCase().includes(filterText.toLowerCase())
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      processed.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (sortConfig.key === "price" || sortConfig.key === "volume") {
          aVal = Number(aVal);
          bVal = Number(bVal);
        }

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return processed;
  };

  const handleRowClick = (symbol) => {
    const next = selectedStock === symbol ? null : symbol;
    setSelectedStock(next);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* MonthlyChart shows price movement for the selected stock */}
      <MonthlyChart selectedSymbol={selectedStock} />

      {/* Filter Input */}
      <div>
        <input
          type="text"
          placeholder="Filter by symbol or name..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className=" px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th
                onClick={() => handleSort("symbol")}
                className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200"
              >
                Symbol{" "}
                {sortConfig.key === "symbol" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("price")}
                className="px-6 py-3 border-b text-right text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200"
              >
                Price{" "}
                {sortConfig.key === "price" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("volume")}
                className="px-6 py-3 border-b text-right text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200"
              >
                Volume{" "}
                {sortConfig.key === "volume" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
            </tr>
          </thead>

          <tbody>
            {getProcessedStocks().map((stock) => (
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
