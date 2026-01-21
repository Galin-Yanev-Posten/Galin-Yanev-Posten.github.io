import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/Form/InputField";
import { useAuth } from "../context/AuthContext";
import { getUserProfile, updateUserProfile } from "../firebase/auth";
import { validateProfile } from "../utils/validators";

export default function Profile() {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        avatar: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        const loadProfile = async () => {
            // Recommendation: Load profile data once per auth state change.
            try {
                const profileData = await getUserProfile(user.uid);
                if (profileData) {
                    setFormData({
                        firstName: profileData.firstName || "",
                        lastName: profileData.lastName || "",
                        email: profileData.email || user.email || "",
                        avatar: profileData.avatar || "",
                    });
                } else {
                    setFormData(prev => ({
                        ...prev,
                        email: user.email || "",
                    }));
                }
            } catch {
                setError("Failed to load profile data");
            }
        };

        loadProfile();
    }, [navigate, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    avatar: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setError("");
        setSuccess("");
    };

    const handleCancel = async () => {
        setIsEditing(false);
        setError("");
        setSuccess("");
        // Reload data from Firestore
        if (user) {
            try {
                const profileData = await getUserProfile(user.uid);
                if (profileData) {
                    setFormData({
                        firstName: profileData.firstName || "",
                        lastName: profileData.lastName || "",
                        email: profileData.email || user.email || "",
                        avatar: profileData.avatar || "",
                    });
                }
            } catch {
                setError("Failed to reload profile data");
            }
        }

        // Recommendation: Cancel stays on the profile instead of redirecting away.
        
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Recommendation: Keep validation logic in a shared helper to avoid duplication.
            const validationError = validateProfile(formData);
            if (validationError) {
                setError(validationError);
                setLoading(false);
                return;
            }

            if (!user) {
                setError("User not authenticated");
                setLoading(false);
                return;
            }

            // Update profile in Firestore
            await updateUserProfile(user.uid, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                avatar: formData.avatar,
            });

            // Optionally update localStorage for quick access
            localStorage.setItem("userData", JSON.stringify(formData));

            setSuccess("Profile updated successfully!");
            setIsEditing(false);
            setLoading(false);

            // Redirect to dashboard after 1.5 seconds
            setTimeout(() => {
                navigate("/dashboard", { replace: true });
            }, 1500);
        } catch (err) {
            setError(err.message || "Failed to update profile");
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center min-h-screen bg-gray-50 py-8">
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-md p-8">
                <h2 className="text-center text-2xl font-semibold mb-6">My Profile</h2>

                {error && <p className="text-red-600 text-sm mb-4 text-center bg-red-50 p-2 rounded">{error}</p>}
                {success && <p className="text-green-600 text-sm mb-4 text-center bg-green-50 p-2 rounded">{success}</p>}

                {!isEditing ? (
                    // View Mode
                    <div className="space-y-4">
                        {/* Avatar Display */}
                        <div className="flex justify-center mb-6">
                            {formData.avatar ? (
                                <img
                                    src={formData.avatar}
                                    alt="Profile Avatar"
                                    className="w-24 h-24 rounded-full border-4 border-gray-200 object-cover"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-3xl font-semibold border-4 border-gray-200">
                                    {formData.firstName?.charAt(0)}{formData.lastName?.charAt(0)}
                                </div>
                            )}
                        </div>

                        <div className="border border-gray-200 rounded-md p-4">
                            <p className="text-xs text-gray-500 uppercase font-semibold">First Name</p>
                            <p className="text-gray-900 text-lg font-medium">{formData.firstName}</p>
                        </div>

                        <div className="border border-gray-200 rounded-md p-4">
                            <p className="text-xs text-gray-500 uppercase font-semibold">Last Name</p>
                            <p className="text-gray-900 text-lg font-medium">{formData.lastName}</p>
                        </div>

                        <div className="border border-gray-200 rounded-md p-4">
                            <p className="text-xs text-gray-500 uppercase font-semibold">Email</p>
                            <p className="text-gray-900 text-lg font-medium">{formData.email}</p>
                        </div>

                        <button
                            onClick={handleEdit}
                            className="w-full bg-black text-white rounded-md px-6 py-2 text-sm shadow-sm hover:bg-gray-900 mt-6"
                        >
                            Edit Profile
                        </button>
                    </div>
                ) : (
                    // Edit Mode
                    <form onSubmit={handleSave} className="space-y-4">
                        {/* Avatar Upload */}
                        <div className="flex justify-center mb-4">
                            {formData.avatar ? (
                                <img
                                    src={formData.avatar}
                                    alt="Profile Avatar"
                                    className="w-24 h-24 rounded-full border-4 border-gray-200 object-cover"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-3xl font-semibold border-4 border-gray-200">
                                    {formData.firstName?.charAt(0)}{formData.lastName?.charAt(0)}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Upload Avatar</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-900"
                            />
                        </div>

                        <div>
                            {/* Recommendation: Use the shared InputField to keep form markup consistent. */}
                            <InputField
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First Name"
                                required
                            />
                        </div>

                        <div>
                            <InputField
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Last Name"
                                required
                            />
                        </div>

                        <div>
                            <InputField
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                required
                            />
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex-1 bg-gray-300 text-gray-900 rounded-md px-4 py-2 text-sm hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-black text-white rounded-md px-4 py-2 text-sm hover:bg-gray-900 disabled:opacity-50"
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
