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
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">
                  リアクトデュエル
                </h1>
                <GameRuleModal />
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-4xl">
            {!isAuthenticated ? (
              <>
                <div className="mt-2 rounded-lg bg-white p-6 shadow">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={userName}
                      maxLength={12}
                      onChange={(e) => setUserName(e.target.value)}
                      className="flex-1 rounded-md border px-3 py-2"
                      placeholder="ユーザー名"
                      onKeyDown={handleKeyDown}
                    />
                    <button
                      onClick={handleLogin}
                      className="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                    >
                      けってい
                    </button>
                  </div>
                </div>
                <div className="mt-2 rounded-lg bg-white p-6 shadow">
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
