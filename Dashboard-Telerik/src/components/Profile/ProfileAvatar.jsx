export default function ProfileAvatar({ avatar, firstName, lastName, onChange, editable }) {
    return (
        <div className="flex justify-center mb-4">
            {avatar ? (
                <img
                    src={avatar}
                    alt="Profile Avatar"
                    className="w-24 h-24 rounded-full border-4 border-gray-200 object-cover"
                />
            ) : (
                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-3xl font-semibold border-4 border-gray-200">
                    {firstName?.charAt(0)}{lastName?.charAt(0)}
                </div>
            )}
            {editable && (
                <div className="mt-2 w-full flex flex-col items-center">
                    <label htmlFor="avatar-upload" className="sr-only">Avatar</label>
                    <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={onChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-900"
                    />
                </div>
            )}
        </div>
    );
}