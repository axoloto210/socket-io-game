import { useState, useEffect, useCallback } from "react";
import { Heart } from "./ui/Heart";
import { RevealedCardComponent } from "./CardGame";

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
    <div>
      <button
        onClick={openModal}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none transition-colors duration-200"
        aria-label="ゲームルール"
      >
        ゲームルール
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div
            className="absolute inset-0"
            onClick={closeModal}
            aria-hidden="true"
          />

          <div className="relative bg-white rounded-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
            {/* ヘッダー部分 - 固定 */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">ゲームルール</h2>
              <button
                onClick={closeModal}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-500 text-xl"
                aria-label="閉じる"
              >
                ×
              </button>
            </div>

            {/* コンテンツ部分 - スクロール可能 */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-8">
                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    ルール
                  </h3>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      勝利条件は、相手の体力
                      <span className="inline-block w-4 h-4 align-text-bottom">
                        <Heart />
                      </span>
                      を0にすることです。
                    </p>
                    <p>
                      お互いに1から5の書かれた数字のカード
                      <span className="inline-block h-6 w-4 overflow-hidden ml-1 mr-1 mt-2">
                        <div className="transform scale-[0.125] origin-top-left">
                          <RevealedCardComponent power={1} />
                        </div>
                      </span>
                      <span className="ml-1 mr-1">~</span>
                      <span className="inline-block h-6 w-4 overflow-hidden ml-1 mr-1 mt-2">
                        <div className="transform scale-[0.125] origin-top-left">
                          <RevealedCardComponent power={5} />
                        </div>
                      </span>
                      とアイテムを持った状態でゲームが始まります。
                    </p>
                    <p>
                      カードを選択して数字の小さい方に1ダメージが与えられます。
                      <br />
                      お互いに同じ数字の場合には両者に1ダメージが与えられます。
                    </p>
                    <p>
                      アイテムを使用することで、カードの数値を変えたりすることができます。
                      <br />
                      アイテムは、カードの勝敗を決定する時に適用されます。
                    </p>
                    <p>
                      カード・アイテムは使用すると、手札から消費され、次のターン以降は使用できなくなります。
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    アイテム
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-2">グウスウ</h4>
                      <p className="text-gray-700">
                        場に出たお互いの偶数カードの値を+2します。
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-2">ムコウカ</h4>
                      <p className="text-gray-700">
                        アイテム効果を適用せずに勝敗を決定します。
                        <br/>
                        5と一緒につかうことはできません。
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-2">リスキー</h4>
                      <p className="text-gray-700">
                        自分のカードの値が-2されますが、勝利した時に2ダメージを与えます。
                        <br />
                        引き分けの時には効果がありません。
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-2">アベコベ</h4>
                      <p className="text-gray-700">
                        カードの勝敗が逆転します。
                        <br/>
                        お互いに使用すると通常の勝敗判定となります。
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-2">ウラギリ</h4>
                      <p className="text-gray-700">
                        引き分けたときに、相手に2ダメージを与え、自分へはダメージを与えません。
                        <br />
                        お互いにウラギリを使用したときには、お互いに2ダメージが与えられます。
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
