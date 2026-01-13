import ProfileAvatar from "./ProfileAvatar";
import ProfileField from "./ProfileField";

export default function ProfileForm({
    formData,
    onChange,
    onAvatarChange,
    onCancel,
    onSave,
    loading
}) {
    return (
        <form onSubmit={onSave} className="space-y-4">
            <ProfileAvatar
                avatar={formData.avatar}
                firstName={formData.firstName}
                lastName={formData.lastName}
                onChange={onAvatarChange}
                editable={true}
            />
            <ProfileField label="First Name" name="firstName" value={formData.firstName} onChange={onChange} editable />
            <ProfileField label="Last Name" name="lastName" value={formData.lastName} onChange={onChange} editable />
            <ProfileField label="Email" name="email" value={formData.email} onChange={onChange} editable type="email" />
            <div className="flex gap-3 mt-6">
                <button type="button" onClick={onCancel} className="flex-1 bg-gray-300 text-gray-900 rounded-md px-4 py-2 text-sm hover:bg-gray-400">
                    Cancel
                </button>
                <button type="submit" disabled={loading} className="flex-1 bg-black text-white rounded-md px-4 py-2 text-sm hover:bg-gray-900 disabled:opacity-50">
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </form>
    );
}