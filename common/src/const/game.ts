export const MAX_HP = 3;

export const RESTRICTED_CARD_AND_ITEM_PAIRS = [
  {
    cardId: 5,
    itemId: 2,
  },
] as const satisfies { cardId: number; itemId: number }[];
