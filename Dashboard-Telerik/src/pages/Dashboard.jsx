import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StocksTable from "../components/StocksList/StocksTable";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    avatar: "",
  });

  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (data) {
      setUserData(JSON.parse(data));
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="text-lg font-semibold">Dashboard app</div>
          <div className="flex gap-4 items-center">
            {/* Avatar Display */}
            <div className="flex items-center gap-2">
              {userData.avatar ? (
                <img
                  src={userData.avatar}
                  alt="Profile Avatar"
                  className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-semibold border-2 border-gray-300">
                  {userData.firstName?.charAt(0)}
                  {userData.lastName?.charAt(0)}
                </div>
              )}
              {/* <span className="text-sm text-gray-700 hidden sm:inline">
                {userData.firstName} {userData.lastName}
              </span> */}
            </div>

            <button
              onClick={() => navigate("/profile")}
              className="bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Profile
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Log out
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-20">
        <StocksTable />
      </main>
    </div>
  );
}
