## カードゲーム
`socket.io`を使用したカードゲームです。
`client`側は`Vite`+`React`+`TypeScript`
`server`側は`Express`+`TypeScript` 
で構成されています。

### ルール
勝利条件は、相手の体力を0にすることです。

お互いに1から5の書かれた数字のカードとアイテムを持った状態でゲームが始まります。

カードを選択して数字の小さい方に1ダメージが与えられます。
お互いに同じ数字の場合には両者に1ダメージが与えられます。

アイテムを使用することで、カードの数値を変えたりすることができます。
アイテムは、カードの勝敗を決定する時に適用されます。

カード・アイテムは使用すると、手札から消費され、次のターン以降は使用できなくなります。

### アイテム
#### グウスウ
場に出たお互いの偶数カードの値を+2します。
#### ムコウカ
アイテム効果を適用せずに勝敗を決定します。
5と一緒につかうことはできません。
#### リスキー
自分のカードの値が-2されますが、勝利した時に2ダメージを与えます。
引き分けの時には効果がありません。
#### アベコベ
カードの勝敗が逆転します。
お互いに使用すると通常の勝敗判定となります。
#### ウラギリ
引き分けたときに、相手に2ダメージを与え、自分へはダメージを与えません。
お互いにウラギリを使用したときには、お互いに2ダメージが与えられます。