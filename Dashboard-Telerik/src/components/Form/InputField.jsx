export default function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
  required,
  className = "",
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm text-gray-600 mb-1" htmlFor={name}>
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className="block w-full border border-gray-200 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10"
      />
    </div>
  );
}
