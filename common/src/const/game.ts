import { Item } from "../types";

export const MAX_HP = 3;

const MUKOUKA_MAX_LIMIT_POWER = 4;

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

  // ムコウカはpower 5以上のカードと使用できない。
  if (itemId === ALL_ITEMS.MUKOUKA.itemId) {
    return power > MUKOUKA_MAX_LIMIT_POWER;
  }

  return false;
};

export const ALL_ITEMS = {
  GUSU: {
    itemId: 1,
    itemName: "グウスウ",
    itemEffect: "場の偶数のパワーを+2するアイテム",
    itemImageUrl: "gusu.webp",
  },
  MUKOUKA: {
    itemId: 2,
    itemName: "ムコウカ",
    itemEffect: "相手のアイテム効果を無効にする",
    itemImageUrl: "mukouka.webp",
  },
  RISKY: {
    itemId: 3,
    itemName: "リスキー",
    itemEffect: "このターンのパワー -2、勝ったら2ダメージ",
    itemImageUrl: "risky.webp",
  },
  ABEKOBE: {
    itemId: 4,
    itemName: "アベコベ",
    itemEffect: "カードの勝敗が逆転",
    itemImageUrl: "abekobe.webp",
  },
  URAGIRI: {
    itemId: 5,
    itemName: "ウラギリ",
    itemEffect:
      "引き分けたときに、相手に2ダメージを与え、自分へはダメージを与えない",
    itemImageUrl: "uragiri.webp",
  },
  TENTEKI: {
    itemId: 6,
    itemName: "テンテキ",
    itemEffect:
      "お互いのカードの数値の差が2のときに勝利します。差が2のときに勝利すると、相手のすべての手札の数値を-1します。お互いがテンテキを使用して差が2のときには、お互いに1ダメージを与えてすべての手札の数値が-1されます。",
    itemImageUrl: "tenteki.webp",
  },
  OUEN: {
    itemId: 7,
    itemName: "オウエン",
    itemEffect:
      "自分のすべての手札の数値を+1します。3と一緒に使うとさらに+1します。",
    itemImageUrl: "ouen.webp",
  },
} as const satisfies { [itemName: string]: Item };

export function calculatePowerDiff({
  playerSelectedCardPower,
  playerSelectedItemId,
  opponentSelectedItemId,
}: {
  playerSelectedCardPower: number;
  playerSelectedItemId?: number;
  opponentSelectedItemId?: number;
}) {

  if(playerSelectedItemId === ALL_ITEMS.MUKOUKA.itemId || opponentSelectedItemId === ALL_ITEMS.MUKOUKA.itemId){
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

  return calculatedPower - playerSelectedCardPower;


  
}
