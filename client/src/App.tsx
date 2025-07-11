import { useEffect, useState } from "react";
import { UserContext } from "./contexts/UserContext";
import { GameRuleModal } from "./components/GameRuleModal";
import { RoomModeSelector } from "./components/RoomModeSelector";

import { Analytics } from "@vercel/analytics/react";
import { GameRule } from "./components/GameRule";

const USER_NAME_KEY = "userName";

function App() {
  const [userName, setUserName] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const savedName = localStorage.getItem(USER_NAME_KEY);
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  const handleLogin = () => {
    if (userName.trim()) {
      setIsAuthenticated(true);
      localStorage.setItem(USER_NAME_KEY, userName);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <>
      <UserContext.Provider value={{ userName, setUserName }}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">
                  リアクトデュエル
                </h1>
                <GameRuleModal />
              </div>
            </div>
          </header>

          <main className="max-w-4xl mx-auto">
            {!isAuthenticated ? (
              <>
                <div className="bg-white shadow rounded-lg p-6 mt-2">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={userName}
                      maxLength={12}
                      onChange={(e) => setUserName(e.target.value)}
                      className="flex-1 border rounded-md px-3 py-2"
                      placeholder="ユーザー名"
                      onKeyDown={handleKeyDown}
                    />
                    <button
                      onClick={handleLogin}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      けってい
                    </button>
                  </div>
                </div>
                <div className="bg-white shadow rounded-lg p-6 mt-2">
                  <GameRule needHeader />
                </div>
              </>
            ) : (
              <RoomModeSelector />
            )}
          </main>
        </div>
      </UserContext.Provider>
      <Analytics />
    </>
  );
}

export default App;
