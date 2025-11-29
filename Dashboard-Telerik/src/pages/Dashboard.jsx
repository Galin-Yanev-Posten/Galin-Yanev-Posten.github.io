import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white">
            <header className="border-b bg-white">
                <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
                    <div className="text-lg font-semibold">Dashboard app</div>
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-black text-white text-sm px-4 py-2 rounded-md"
                    >
                        Log out
                    </button>
                </div>
            </header>
            <main className="max-w-6xl mx-auto px-6 py-20">
                <h1>Welcome to Dashboard</h1>
            </main>
        </div>
    );
}