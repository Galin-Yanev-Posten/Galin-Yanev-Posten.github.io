import ProfileAvatar from "./ProfileAvatar";
import ProfileField from "./ProfileField";

export default function ProfileView({ formData, onEdit }) {
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
            <button
                onClick={onEdit}
                className="w-full bg-black text-white rounded-md px-6 py-2 text-sm shadow-sm hover:bg-gray-900 mt-6"
            >
                Edit Profile
            </button>
        </div>
    );
}