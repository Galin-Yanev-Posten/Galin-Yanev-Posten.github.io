export default function ProfileField({ label, value, name, onChange, editable, type = "text" }) {
    return (
        <div>
            <label htmlFor={name} className="block text-sm text-gray-600 mb-1">{label}</label>
            {editable ? (
                <input
                    id={name}
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={label}
                    className="block w-full border border-gray-200 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10"
                    required
                />
            ) : (
                <div className="border border-gray-200 rounded-md p-4">
                    <p className="text-xs text-gray-500 uppercase font-semibold">{label}</p>
                    <p className="text-gray-900 text-lg font-medium">{value}</p>
                </div>
            )}
        </div>
    );
}