import { useState } from "react";
import { useMonthlyChartData } from "../../hooks/useMonthlyChartData";
import EmptyState from "../common/EmptyState";
import LoadingMessage from "../common/LoadingMessage";
import ChartHeader from "./ChartHeader";
import MonthlyLineChart from "./MonthlyLineChart";

export default function MonthlyChart({ selectedSymbol }) {
    const [monthsBack, setMonthsBack] = useState(12);
    const { chartData, loading } = useMonthlyChartData(selectedSymbol, monthsBack);

    if (!selectedSymbol) {
        return <EmptyState message="Select a stock to view monthly chart" />;
    }

    if (loading) {
        return <LoadingMessage message="Loading chart..." />;
    }

    return (
        <div className="bg-white border border-gray-300 rounded-lg p-6">
            <ChartHeader
                selectedSymbol={selectedSymbol}
                monthsBack={monthsBack}
                setMonthsBack={setMonthsBack}
            />
            <MonthlyLineChart chartData={chartData} />
        </div>
    );
}