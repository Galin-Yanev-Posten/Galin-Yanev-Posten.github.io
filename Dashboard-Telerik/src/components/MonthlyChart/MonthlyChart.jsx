import { useMemo, useState } from "react";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { useGetMonthlySeriesQuery } from "../../store/alphaVantageApi";
import { API_KEY } from "../../services/alphaVantage";

export default function MonthlyChart({ selectedSymbol }) {
    const [monthsBack, setMonthsBack] = useState(12);

    const { data, isLoading, isError } = useGetMonthlySeriesQuery(
        selectedSymbol,
        {
            skip: !selectedSymbol,
        }
    );

    const monthlyData = data?.["Monthly Time Series"];
    const chartData = useMemo(() => {
        if (!monthlyData) return [];

        return Object.entries(monthlyData)
            .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
            .slice(-monthsBack)
            .map(([date, values]) => ({
                date,
                price: parseFloat(values["4. close"]),
                high: parseFloat(values["2. high"]),
                low: parseFloat(values["3. low"]),
            }));
    }, [monthlyData, monthsBack]);

    if (!selectedSymbol) {
        return (
            <div className="bg-white border border-gray-300 rounded-lg p-8 text-center">
                <p className="text-gray-600">Select a stock to view monthly chart</p>
            </div>
        );
    }

    // Recommendation: Short-circuit on missing API key so the UI stays clear.
    if (!API_KEY) {
        return (
            <div className="bg-white border border-gray-300 rounded-lg p-8 text-center">
                <p className="text-gray-600">Missing API key for chart data.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="bg-white border border-gray-300 rounded-lg p-8 text-center">
                <p className="text-gray-600">Loading chart...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-white border border-gray-300 rounded-lg p-8 text-center">
                <p className="text-gray-600">Could not load chart data.</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-300 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">{selectedSymbol}</h2>
                    <p className="text-gray-600 text-sm">Monthly Price Movement</p>
                </div>

                <div className="flex gap-2">
                    {[3, 6, 12, 24].map((months) => (
                        <button
                            key={months}
                            onClick={() => setMonthsBack(months)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                                monthsBack === months
                                    ? "bg-black text-white"
                                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                            }`}
                        >
                            {months}M
                        </button>
                    ))}
                </div>
            </div>

            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(date) => new Date(date).toLocaleDateString("en-US", { year: "2-digit", month: "short" })}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                        formatter={(value) => `$${value.toFixed(2)}`}
                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#000000"
                        name="Close Price"
                        dot={false}
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
