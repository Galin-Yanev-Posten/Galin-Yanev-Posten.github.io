import { useEffect, useState } from "react";
import { fetchMonthlyData } from "../services/alphaVantage";

export function useMonthlyChartData(selectedSymbol, monthsBack = 12) {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!selectedSymbol) return;

        const loadData = async () => {
            setLoading(true);
            try {
                const monthlyData = await fetchMonthlyData(selectedSymbol);
                if (monthlyData) {
                    const sorted = Object.entries(monthlyData)
                        .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
                        .slice(-monthsBack)
                        .map(([date, values]) => ({
                            date,
                            price: parseFloat(values["4. close"]),
                            high: parseFloat(values["2. high"]),
                            low: parseFloat(values["3. low"]),
                        }));
                    setChartData(sorted);
                }
            } catch (error) {
                console.error("Error loading chart data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [selectedSymbol, monthsBack]);

    return { chartData, loading };
}