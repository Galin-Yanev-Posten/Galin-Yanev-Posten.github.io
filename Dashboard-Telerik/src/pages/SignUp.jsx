import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        confirmEmail: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Validation
            if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
                setError("All fields are required");
                setLoading(false);
                return;
            }

            if (formData.email !== formData.confirmEmail) {
                setError("Emails do not match");
                setLoading(false);
                return;
            }

            if (formData.password !== formData.confirmPassword) {
                setError("Passwords do not match");
                setLoading(false);
                return;
            }

            if (formData.password.length < 6) {
                setError("Password must be at least 6 characters");
                setLoading(false);
                return;
            }

            // Save user data to localStorage
            const userData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
            };
            localStorage.setItem("userData", JSON.stringify(userData));
            console.log("Sign up successful, redirecting to login...");
            navigate("/login", { replace: true });
        } catch (err) {
            setError(err.message || "Sign up failed");
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center">
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-md p-8">
                <h2 className="text-center text-xl font-semibold mb-6">Create your account</h2>

                {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

                <div className="flex gap-3 mb-4">
                    <div className="flex-1">
                        <label className="block text-sm text-gray-600 mb-1">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="First Name"
                            className="block w-full border border-gray-200 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10"
                            disabled={loading}
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm text-gray-600 mb-1">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Last Name"
                            className="block w-full border border-gray-200 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10"
                            disabled={loading}
                            required
                        />
                    </div>
                </div>

                <label className="block text-sm text-gray-600 mb-1">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="block w-full border border-gray-200 rounded-md px-3 py-2 mb-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10"
                    disabled={loading}
                    required
                />

                <label className="block text-sm text-gray-600 mb-1">Confirm Email</label>
                <input
                    type="email"
                    name="confirmEmail"
                    value={formData.confirmEmail}
                    onChange={handleChange}
                    placeholder="Confirm your email"
                    className="block w-full border border-gray-200 rounded-md px-3 py-2 mb-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10"
                    disabled={loading}
                    required
                />

                <label className="block text-sm text-gray-600 mb-1">Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="block w-full border border-gray-200 rounded-md px-3 py-2 mb-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10"
                    disabled={loading}
                    required
                />

                <label className="block text-sm text-gray-600 mb-1">Confirm Password</label>
                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
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
                        {loading ? "Creating account..." : "Sign Up"}
                    </button>
                </div>

                <p className="text-center text-gray-600 mt-4">
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                        Sign In
                    </button>
                </p>
            </form>
        </div>
    );
}