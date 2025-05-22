import { Item } from "../types";

export const MAX_HP = 3;

export const RESTRICTED_CARD_AND_ITEM_PAIRS = [
  {
    cardId: 5,
    itemId: 2,
  },
] as const satisfies { cardId: number; itemId: number }[];

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
} as const satisfies { [itemName: string]: Item };
