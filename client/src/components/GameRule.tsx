import { RevealedCardComponent } from "./CardGame";
import { Heart } from "./ui/Heart";

export const GameRule = ({ needHeader }: { needHeader: boolean }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="space-y-8">
        <section>
          {needHeader && (
            <h3 className="text-xl font-bold text-gray-900 mb-4">ルール</h3>
          )}
          <div className="space-y-3 text-gray-700">
            <p>
              勝利条件は、相手の体力
              <span className="inline-block w-4 h-4 align-text-bottom">
                <Heart />
              </span>
              を0にすることです。
            </p>
            <div>
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
            </div>
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
          <h3 className="text-xl font-bold text-gray-900 mb-4">アイテム</h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                <img src="gusu.webp" width={40} height={40} className="mr-4" />
                グウスウ
              </h4>

              <p className="text-gray-700">
                場に出たお互いの偶数カードの値を+2します。
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                <img
                  src="mukouka.webp"
                  width={40}
                  height={40}
                  className="mr-4"
                />
                ムコウカ
              </h4>
              <p className="text-gray-700">
                アイテム効果を適用せずに勝敗を決定します。
                <br />
                5以上の数値のカードとつかうことはできません。
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                <img src="risky.webp" width={40} height={40} className="mr-4" />
                リスキー
              </h4>
              <p className="text-gray-700">
                自分のカードの値が-2されますが、勝利した時に2ダメージを与えます。
                <br />
                引き分けの時には効果がありません。
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                <img
                  src="abekobe.webp"
                  width={40}
                  height={40}
                  className="mr-4"
                />
                アベコベ
              </h4>
              <p className="text-gray-700">
                カードの勝敗が逆転します。
                <br />
                お互いに使用すると通常の勝敗判定となります。
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                <img
                  src="uragiri.webp"
                  width={40}
                  height={40}
                  className="mr-4"
                />
                ウラギリ
              </h4>
              <p className="text-gray-700">
                引き分けたときに、相手に2ダメージを与え、自分へはダメージを与えません。
                <br />
                お互いにウラギリを使用したときには、お互いに2ダメージが与えられます。
              </p>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">DXモードアイテム</h3>
            <p>
              追加アイテムも含めて、各々ランダムに5つ持った状態で始まるモードです。
            </p>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                <img
                  src="tenteki.webp"
                  width={40}
                  height={40}
                  className="mr-4"
                />
                テンテキ
              </h4>
              <p className="text-gray-700">
                お互いのカードの数値の差が2のときに勝利します。
                <br/>
                差が2のとき、アベコベは無効化されます。
                <br />
                差が2のときに勝利すると、相手のすべての手札の数値を-1します。
                <br />
                お互いがテンテキを使用して差が2のときには、お互いに1ダメージを与えてすべての手札の数値が-1されます。
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                <img src="ouen.webp" width={40} height={40} className="mr-4" />
                オウエン
              </h4>
              <p className="text-gray-700">
                自分のすべての手札の数値を+1します。
                <br />
                3と一緒に使うとさらに+1します。
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
