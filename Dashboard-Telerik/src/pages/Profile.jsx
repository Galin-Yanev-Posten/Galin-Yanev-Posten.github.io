import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

    // Load user data from localStorage on component mount
    useEffect(() => {
        const userData = localStorage.getItem("userData");
        if (userData) {
            setFormData(JSON.parse(userData));
        }
    }, []);

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

    const handleCancel = () => {
        setIsEditing(false);
        setError("");
        setSuccess("");
        // Reload data from localStorage
        const userData = localStorage.getItem("userData");
        if (userData) {
            setFormData(JSON.parse(userData));
        }

        setTimeout(() => {
            navigate("/dashboard", { replace: true });
        }, 1500);
        
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (!formData.firstName || !formData.lastName || !formData.email) {
                setError("All fields are required");
                setLoading(false);
                return;
            }

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
                            <label className="block text-sm text-gray-600 mb-1">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First Name"
                                className="block w-full border border-gray-200 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Last Name"
                                className="block w-full border border-gray-200 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="block w-full border border-gray-200 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10"
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