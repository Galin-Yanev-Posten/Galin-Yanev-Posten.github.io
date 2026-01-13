export default function LoadingMessage({ message = "Loading..." }) {
    return (
        <div className="bg-white border border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-600">{message}</p>
        </div>
    );
}