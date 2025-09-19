import { useState, useEffect, useCallback } from "react";
import { GameRule } from "./GameRule";

export const GameRuleModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      closeModal();
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  return (
    <div>
      <button
        onClick={openModal}
        className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white shadow-sm transition-colors duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        aria-label="ルール"
      >
        ルール
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div
            className="absolute inset-0"
            onClick={closeModal}
            aria-hidden="true"
          />

          <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900">ルール</h2>
              <button
                onClick={closeModal}
                className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-gray-500 transition-colors duration-200 hover:bg-gray-100"
                aria-label="閉じる"
              >
                ×
              </button>
            </div>
            <GameRule needHeader={false} />
          </div>
        </div>
      )}
    </div>
  );
};
