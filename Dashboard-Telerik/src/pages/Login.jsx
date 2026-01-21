import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/Form/InputField";
import { useAuth } from "../context/AuthContext";
import { mapAuthError } from "../utils/authErrors";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Recommendation: Map Firebase errors to friendlier messages for better UX.
      await signIn(email, password);
      navigate("/dashboard");
    } catch (err) {
      const friendly = mapAuthError(err.code);
      setError(friendly || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-md p-8"
      >
        <h2 className="text-center text-xl font-semibold mb-6">
          Enter your login details
        </h2>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        {/* Recommendation: Reuse a shared input component to reduce duplicated markup. */}
        <InputField
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your e-mail"
          disabled={loading}
          required
          className="mb-4"
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          disabled={loading}
          required
          className="mb-6"
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
