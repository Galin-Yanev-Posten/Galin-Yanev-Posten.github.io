import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileForm from "../components/Profile/ProfileForm";
import ProfileView from "../components/Profile/ProfileView";
import { auth, getUserProfile, onAuthStateChanged, updateUserProfile } from "../firebase/auth";

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
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    // Listen to auth state and load user profile from Firestore
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
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
            } else {
                setCurrentUser(null);
                navigate("/login");
            }
        });

        return () => unsubscribe();
    }, [navigate]);

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
        navigate("/dashboard", { replace: true });
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

            if (!currentUser) {
                setError("User not authenticated");
                setLoading(false);
                return;
            }

            await updateUserProfile(currentUser.uid, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                avatar: formData.avatar,
            });

            localStorage.setItem("userData", JSON.stringify(formData));

            setSuccess("Profile updated successfully!");
            setIsEditing(false);
            setLoading(false);

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
                    <ProfileView formData={formData} onEdit={handleEdit} onCancel={() => navigate("/dashboard", { replace: true })} />
                ) : (
                    <ProfileForm
                        formData={formData}
                        onChange={handleChange}
                        onAvatarChange={handleAvatarChange}
                        onCancel={handleCancel}
                        onSave={handleSave}
                        loading={loading}
                    />
                )}
            </div>
        </div>
    );
}