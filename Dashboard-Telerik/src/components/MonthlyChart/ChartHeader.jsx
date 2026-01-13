export default function ChartHeader({ selectedSymbol, monthsBack, setMonthsBack }) {
    return (
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
    );
}