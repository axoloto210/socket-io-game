import { useState } from "react";
import Room from "./components/Room";
import { UserContext } from "./contexts/UserContext";

function App() {
  const [userName, setUserName] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // ユーザー名入力処理
  const handleLogin = () => {
    if (userName.trim()) {
      setIsAuthenticated(true);
    }
  };

  return (
    <UserContext.Provider value={{ userName, setUserName }}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              うぱゲーカードバトル
            </h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!isAuthenticated ? (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">ユーザー名を入力</h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="flex-1 border rounded-md px-3 py-2"
                  placeholder="ユーザー名"
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
                <button
                  onClick={handleLogin}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  開始
                </button>
              </div>
            </div>
          ) : (
            <Room />
          )}
        </main>
      </div>
    </UserContext.Provider>
  );
}

export default App;