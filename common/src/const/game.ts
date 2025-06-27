import { Item } from "../types";

export const MAX_HP = 3;

const MUKOUKA_MAX_LIMIT_POWER = 4;

const KOURIN_MAX_LIMIT_POWER = 2;

export const isRestrictedPair = ({
  power,
  itemId,
}: {
  power?: number;
  itemId?: number;
}): boolean => {
  if (itemId === undefined || power === undefined) {
    return false;
  }

  // ムコウカはpowerがMUKOUKA_MAX_LIMIT_POWER より大きいカードと使用できない。
  if (itemId === ALL_ITEMS.MUKOUKA.itemId) {
    return power > MUKOUKA_MAX_LIMIT_POWER;
  }

  // コウリンはpowerがMUKOUKA_MAX_LIMIT_POWER より大きいカードと使用できない。
  if(itemId === ALL_ITEMS.KOURIN.itemId){
    return power > KOURIN_MAX_LIMIT_POWER;
  }

  return false;
};

export const ALL_ITEMS = {
  GUSU: {
    itemId: 1,
    itemName: "グウスウ",
    itemEffect: "場に出たお互いの偶数カードの値を+2します。",
    itemImageUrl: "gusu.webp",
  },
  MUKOUKA: {
    itemId: 2,
    itemName: "ムコウカ",
    itemEffect:
      "アイテム効果を適用せずに勝敗を決定します。\n5以上の数値のカードとつかうことはできません。",
    itemImageUrl: "mukouka.webp",
  },
  RISKY: {
    itemId: 3,
    itemName: "リスキー",
    itemEffect:
      "自分のカードの値が-2されますが、勝利した時に2ダメージを与えます。\n引き分けの時には効果がありません。",
    itemImageUrl: "risky.webp",
  },
  ABEKOBE: {
    itemId: 4,
    itemName: "アベコベ",
    itemEffect:
      "カードの勝敗が逆転します。\nお互いに使用すると通常の勝敗判定となります。",
    itemImageUrl: "abekobe.webp",
  },
  URAGIRI: {
    itemId: 5,
    itemName: "ウラギリ",
    itemEffect:
      "引き分けたときに、相手に2ダメージを与え、自分へはダメージを与えません。\nお互いにウラギリを使用したときには、お互いに2ダメージが与えられます。",
    itemImageUrl: "uragiri.webp",
  },
  TENTEKI: {
    itemId: 6,
    itemName: "テンテキ",
    itemEffect:
      "お互いのカードの数値の差が2のときに勝利します。\n差が2のとき、アベコベは無効化されます。\n差が2のときに勝利すると、相手のすべての手札の数値を-1します。\nお互いがテンテキを使用して差が2のときには、お互いに1ダメージを与えてすべての手札の数値が-1されます。",
    itemImageUrl: "tenteki.webp",
  },
  OUEN: {
    itemId: 7,
    itemName: "オウエン",
    itemEffect:
      "自分のすべての手札の数値を+1します。\n3と一緒に使うとさらに+1します。",
    itemImageUrl: "ouen.webp",
  },
  KOURIN: {
    itemId: 8,
    itemName: "コウリン",
    itemEffect: "自分のアイテムを全て失い、神のアイテム2つを得る。\n3以上の数値のカードとつかうことはできません。",
    itemImageUrl: "kourin.webp",
  },
  KOURIN_YUIGA_DOKUSON: {
    itemId: 9,
    itemName: "唯我独尊",
    itemEffect: "神のアイテム。\n相手のカードの値と異なる値のカードを出すと勝利するが、同じ値の時には敗北する。",
    itemImageUrl: "kourin_yuiga_dokuson.webp",
  },
  KOURIN_SINRYU:{
    itemId: 10,
    itemName: "神龍",
    itemEffect: "神のアイテム。\n自分のカードの値を+2する。\n勝利したとき、通常ダメージの代わりに自分のカードの値と相手のカードの値の差の半分のダメージ（端数は切り上げ）を与える。",
    itemImageUrl: "kourin_sinryu.webp",
  },
  KOURIN_ZENCHI_ZENNOU:{
    itemId: 11,
    itemName:"全知全能",
    itemEffect:"神のアイテム。\nライフを1回復する。\n自分の手札のカードと相手の手札のカードを全て入れ替える。",
    itemImageUrl:"kourin_zenchi_zennou.webp",
  }
} as const satisfies { [itemName: string]: Item };

//TODO: パワー計算ロジックが重複しているので統合する。
export function calculatePowerDiff({
  playerSelectedCardPower,
  playerSelectedItemId,
  opponentSelectedItemId,
}: {
  playerSelectedCardPower: number;
  playerSelectedItemId?: number;
  opponentSelectedItemId?: number;
}) {
  if (
    playerSelectedItemId === ALL_ITEMS.MUKOUKA.itemId ||
    opponentSelectedItemId === ALL_ITEMS.MUKOUKA.itemId
  ) {
    return 0;
  }

  let calculatedPower = playerSelectedCardPower;
  // Gusu
  if (playerSelectedItemId === ALL_ITEMS.GUSU.itemId) {
    if (playerSelectedCardPower % 2 === 0) {
      calculatedPower += 2;
    }
  }

  if (opponentSelectedItemId === ALL_ITEMS.GUSU.itemId) {
    if (playerSelectedCardPower % 2 === 0) {
      calculatedPower += 2;
    }
  }

  // Risky
  if (playerSelectedItemId === ALL_ITEMS.RISKY.itemId) {
    calculatedPower -= 2;
  }

  // KOURIN_SINRYU
  if(playerSelectedItemId === ALL_ITEMS.KOURIN_SINRYU.itemId){
    calculatedPower += 2;
  }

  return calculatedPower - playerSelectedCardPower;
}
