import ProfileAvatar from "./ProfileAvatar";
import ProfileField from "./ProfileField";

export default function ProfileView({ formData, onEdit, onCancel }) {
    return (
        <div className="space-y-4">
            <ProfileAvatar
                avatar={formData.avatar}
                firstName={formData.firstName}
                lastName={formData.lastName}
                editable={false}
            />
            <ProfileField label="First Name" value={formData.firstName} />
            <ProfileField label="Last Name" value={formData.lastName} />
            <ProfileField label="Email" value={formData.email} />
            <div className="flex gap-3 mt-6">
                <button
                    onClick={onCancel}
                    className="flex-1 bg-gray-300 text-gray-900 rounded-md px-6 py-2 text-sm shadow-sm hover:bg-gray-400"
                >
                    Cancel
                </button>
                <button 
                    onClick={onEdit}
                    className="flex-1 bg-black text-white rounded-md px-6 py-2 text-sm shadow-sm hover:bg-gray-900"
                >
                    Edit Profile
                </button>
            </div>
        </div>
    );
}