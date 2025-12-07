import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (!username || !password) {
                setError("Username and password required");
                setLoading(false);
                return;
            }
            
            console.log("Login successful, redirecting...");
            localStorage.setItem("authToken", "fake-token");
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(err.message || "Login failed");
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center">
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-md p-8">
                <h2 className="text-center text-xl font-semibold mb-6">Enter your login details</h2>

                {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

                <label className="block text-sm text-gray-600 mb-1">Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername("admin")}
                    // onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="block w-full border border-gray-200 rounded-md px-3 py-2 mb-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10"
                    disabled={loading}
                    required
                />

                <label className="block text-sm text-gray-600 mb-1">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword("admin")}
                    // onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="block w-full border border-gray-200 rounded-md px-3 py-2 mb-6 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10"
                    disabled={loading}
                    required
                />

                <div className="flex justify-center">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white rounded-md px-6 py-2 text-sm shadow-sm hover:bg-gray-900 disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Log in"}
                    </button>
                </div>

                <p className="text-center text-gray-600 mt-4">
                    Don't have an account?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/signup")}
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                        Sign Up
                    </button>
                </p>
            </form>
        </div>
    );
}