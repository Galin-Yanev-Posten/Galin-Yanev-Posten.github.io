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

export default function MonthlyLineChart({ chartData }) {
    return (
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
    );
}