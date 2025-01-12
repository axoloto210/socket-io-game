import { useState, useEffect, useCallback } from "react";

export const GameRule = () => {
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
    <>
      <button
        onClick={openModal}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        aria-label="ゲームルール"
      >
        ゲームルール
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={closeModal}
            aria-hidden="true"
          />

          <div className="relative bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">ゲームルール</h2>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                aria-label="閉じる"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4">
              <section>
                <h3 className="font-bold text-lg mb-2">ルール</h3>
                <p className="mb-2">
                  勝利条件は、相手の体力を0にすることです。
                </p>
                <p className="mb-2">
                  お互いに1から5の書かれた数字のカードとアイテムを持った状態でゲームが始まります。
                </p>
                <p className="mb-2">
                  カードを選択して数字の小さい方に1ダメージが与えられます。お互いに同じ数字の場合には両者に1ダメージが与えられます。
                </p>
                <p>
                  アイテムを使用することで、カードの数値を変えたりすることができます。アイテムは、カードの勝敗を決定する時に適用されます。
                </p>
                <p>
                  カード・アイテムは使用すると、手札から消費され、次のターン以降は使用できなくなります。
                </p>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-2">アイテム</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold">グウスウ</h4>
                    <p>場に出た偶数カードの値を+2します。</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">ムコウカ</h4>
                    <p>アイテム効果を適用せずに勝敗を決定します。</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">リスキー</h4>
                    <p>
                      カードの値が-2されますが、勝利した時に2ダメージを与えります。引き分けの時には効果がありません。
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
