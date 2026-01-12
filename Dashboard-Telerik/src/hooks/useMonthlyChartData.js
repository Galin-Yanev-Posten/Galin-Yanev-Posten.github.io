import { useEffect, useState } from "react";
import { fetchMonthlyData } from "../services/alphaVantage";

type ChartDataPoint = {
    date: string;
    price: number;
    high: number;
    low: number;
};

export function useMonthlyChartData(selectedSymbol: string, monthsBack: number = 12) {
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!selectedSymbol) return;

        const loadData = async () => {
            setLoading(true);
            try {
                const monthlyData = await fetchMonthlyData(selectedSymbol);
                if (monthlyData) {
                    const sorted = Object.entries(monthlyData)
                        .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
                        .slice(-monthsBack)
                        .map(([date, values]) => {
                            const v = values;
                            return {
                                date,
                                price: parseFloat(v["4. close"]),
                                high: parseFloat(v["2. high"]),
                                low: parseFloat(v["3. low"]),
                            };
                        });
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