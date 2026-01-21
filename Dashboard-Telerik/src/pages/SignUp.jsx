import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/Form/InputField";
import { useAuth } from "../context/AuthContext";
import { mapAuthError } from "../utils/authErrors";
import { validateSignUp } from "../utils/validators";

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
  const { signUp } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Recommendation: Keep form validation in a small helper for reuse and readability.
      const validationError = validateSignUp(formData);
      if (validationError) {
        setError(validationError);
        setLoading(false);
        return;
      }

      // Recommendation: Store first/last name during sign-up so Profile can render them.
      await signUp(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      const friendly = mapAuthError(err.code);
      setError(friendly || err.message || "Sign up failed");
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
          Create your account
        </h2>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        {/* Recommendation: Use a shared input component to cut down repetitive JSX. */}
        <div className="flex gap-3 mb-4">
          <InputField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            disabled={loading}
            required
            className="flex-1"
          />
          <InputField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            disabled={loading}
            required
            className="flex-1"
          />
        </div>

        <InputField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          disabled={loading}
          required
          className="mb-4"
        />

        <InputField
          label="Confirm Email"
          name="confirmEmail"
          type="email"
          value={formData.confirmEmail}
          onChange={handleChange}
          placeholder="Confirm your email"
          disabled={loading}
          required
          className="mb-4"
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          disabled={loading}
          required
          className="mb-4"
        />

        <InputField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
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
