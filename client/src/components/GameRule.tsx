import { RevealedCardComponent } from "./CardGame";
import { Heart } from "./ui/Heart";

//TODO: アイテムの説明はALL_ITEMSの情報から生成できる。
export const GameRule = ({ needHeader }: { needHeader: boolean }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="space-y-8">
        <section>
          {needHeader && (
            <h3 className="mb-4 text-xl font-bold text-gray-900">ルール</h3>
          )}
          <div className="space-y-3 text-gray-700">
            <p>
              勝利条件は、相手の体力
              <span className="inline-block h-4 w-4 align-text-bottom">
                <Heart />
              </span>
              を0にすることです。
            </p>
            <div>
              お互いに1から5の書かれた数字のカード
              <span className="ml-2 mr-2 inline-block h-12 w-8 overflow-hidden align-middle max-md:h-6 max-md:w-4">
                <div className="origin-top-left scale-[0.25] transform">
                  <RevealedCardComponent power={1} />
                </div>
              </span>
              <span className="ml-1 mr-1">~</span>
              <span className="ml-2 mr-2 inline-block h-12 w-8 overflow-hidden align-middle max-md:h-6 max-md:w-4">
                <div className="origin-top-left scale-[0.25] transform">
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
              <br />
              出せるカードのなくなると、その時点での残り体力が多い方が勝ちとなります。
            </p>
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-xl font-bold text-gray-900">アイテム</h3>
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <h4 className="mb-2 flex items-center font-bold text-gray-900">
                <img src="gusu.webp" width={40} height={40} className="mr-4" />
                グウスウ
              </h4>

              <p className="text-gray-700">
                場に出たお互いの偶数カードの値を+2します。
              </p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <h4 className="mb-2 flex items-center font-bold text-gray-900">
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
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <h4 className="mb-2 flex items-center font-bold text-gray-900">
                <img src="risky.webp" width={40} height={40} className="mr-4" />
                リスキー
              </h4>
              <p className="text-gray-700">
                自分のカードの値が-2されますが、勝利した時に2ダメージを与えます。
                <br />
                引き分けの時には効果がありません。
              </p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <h4 className="mb-2 flex items-center font-bold text-gray-900">
                <img
                  src="abekobe.webp"
                  width={40}
                  height={40}
                  className="mr-4"
                />
                アベコベ
              </h4>
              <p className="text-gray-700">
                カードの数値による勝敗が逆転します。
                <br />
                お互いに使用すると通常の勝敗判定となります。
              </p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <h4 className="mb-2 flex items-center font-bold text-gray-900">
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
            <h3 className="mb-4 text-xl font-bold text-gray-900">
              DXモードアイテム
            </h3>
            <p>
              アベコベ・コウリンと残り6個のアイテムから3個ずつをランダムに持った状態で始まるモードです。
              <br />
              ランダムに選ばれるアイテムは自分と相手が同じものを1つももたないように選ばれます。
            </p>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <h4 className="mb-2 flex items-center font-bold text-gray-900">
                <img
                  src="tenteki.webp"
                  width={40}
                  height={40}
                  className="mr-4"
                />
                テンテキ
              </h4>
              <p className="text-gray-700">
                お互いのカードの数値の差が2のときにも勝利します。
                <br />
                差が2のときに勝利すると、相手のすべての手札の数値を-1します。
                <br />
                お互いがテンテキを使用して差が2のときには、お互いに1ダメージを与えてすべての手札の数値が-1されます。
                <br />
                テンテキの勝利判定は、アベコベ・唯我独尊の勝利判定よりも優先されます。
              </p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <h4 className="mb-2 flex items-center font-bold text-gray-900">
                <img src="ouen.webp" width={40} height={40} className="mr-4" />
                オウエン
              </h4>
              <p className="text-gray-700">
                自分のすべての手札の数値を+1します。
                <br />
                3と一緒に使うとさらに+1します。
              </p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <h4 className="mb-2 flex items-center font-bold text-gray-900">
                <img
                  src="kourin.webp"
                  width={40}
                  height={40}
                  className="mr-4"
                />
                コウリン
              </h4>
              <p className="text-gray-700">
                自分のアイテムを全て失い、神のアイテム2つを得る。
                <br />
                3以上の数値のカードとつかうことはできません。
              </p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <h4 className="mb-2 flex items-center font-bold text-gray-900">
                <img
                  src="kourin_yuiga_dokuson.webp"
                  width={40}
                  height={40}
                  className="mr-4"
                />
                唯我独尊
              </h4>
              <p className="text-gray-700">
                神のアイテム。
                <br />
                相手のカードの値と異なる値のカードを出すと勝利するが、同じ値の時には敗北する。
                <br />
                お互いに使用すると通常の勝敗判定となります。
                <br />
                テンテキによる勝敗判定が優先されます。
              </p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <h4 className="mb-2 flex items-center font-bold text-gray-900">
                <img
                  src="kourin_sinryu.webp"
                  width={40}
                  height={40}
                  className="mr-4"
                />
                神龍
              </h4>
              <p className="text-gray-700">
                神のアイテム。
                <br />
                自分のカードの値を+2する。
                <br />
                勝利したとき、通常ダメージの代わりに自分のカードの値と相手のカードの値の差の半分のダメージ（端数は切り上げ）を与える。
              </p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <h4 className="mb-2 flex items-center font-bold text-gray-900">
                <img
                  src="kourin_zenchi_zennou.webp"
                  width={40}
                  height={40}
                  className="mr-4"
                />
                全知全能
              </h4>
              <p className="text-gray-700">
                神のアイテム。
                <br />
                ライフを1回復する。
                <br />
                自分の手札のカードと相手の手札のカードを全て入れ替える。
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
