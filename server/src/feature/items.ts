import { Card, Item } from "@socket-io-game/common";

export class Items {
  private INITIAL_ITEMS = [
    {
      itemId: 1,
      itemName: "グウスウ",
      itemEffect: "場の偶数のパワーを+2するアイテム",
      itemImageUrl: "gusu.webp",
    },
    {
      itemId: 2,
      itemName: "ムコウカ",
      itemEffect: "相手のアイテム効果を無効にする",
      itemImageUrl: "mukouka.webp",
    },
    {
      itemId: 3,
      itemName: "リスキー",
      itemEffect: "このターンのパワー -2、勝ったら2ダメージ",
      itemImageUrl: "risky.webp",
    },
    {
      itemId: 4,
      itemName: "アベコベ",
      itemEffect: "カードの勝敗が逆転",
      itemImageUrl: "abekobe.webp",
    },
    {
      itemId: 5,
      itemName: "ウラギリ",
      itemEffect:
        "引き分けたときに、相手に2ダメージを与え、自分へはダメージを与えない",
      itemImageUrl: "uragiri.webp",
    },
  ] as const satisfies Item[];

  getInitialItems() {
    return structuredClone(this.INITIAL_ITEMS);
  }

  applyGusuEffect(player1SelectedCard: Card, player2SelectedCard: Card) {
    if (player1SelectedCard.power % 2 === 0) {
      player1SelectedCard.power += 2;
    }
    if (player2SelectedCard.power % 2 === 0) {
      player2SelectedCard.power += 2;
    }
  }

  isMukouEffect(player1SelectedItem?: Item, player2SelectedItem?: Item) {
    return (
      player1SelectedItem?.itemId === 2 || player2SelectedItem?.itemId === 2
    );
  }

  applyRiskyEffect(playerSelectedCard: Card) {
    playerSelectedCard.power -= 2;
  }

  /**
   * 勝敗が逆転する時には真。
   *
   * @param firstPlayerSelectedItem
   * @param secondPlayerSelectedItem
   * @returns
   */
  isAbekobe(
    firstPlayerSelectedItem?: Item,
    secondPlayerSelectedItem?: Item
  ): boolean {
    if (
      firstPlayerSelectedItem?.itemId === 4 &&
      secondPlayerSelectedItem?.itemId !== 4
    ) {
      return true;
    } else if (
      firstPlayerSelectedItem?.itemId !== 4 &&
      secondPlayerSelectedItem?.itemId === 4
    ) {
      return true;
    }

    return false;
  }

  getDrawBasePoint(
    basePoint: number,
    player1SelectedItem?: Item,
    player2SelectedItem?: Item
  ): { player1BasePoint: number; player2BasePoint: number } {
    // ウラギリ
    if (
      player1SelectedItem?.itemId === 5 &&
      player2SelectedItem?.itemId === 5
    ) {
      return {
        player1BasePoint: 2,
        player2BasePoint: 2,
      };
    } else if (
      player1SelectedItem?.itemId === 5 &&
      player2SelectedItem?.itemId !== 5
    ) {
      return {
        player1BasePoint: 0,
        player2BasePoint: 2,
      };
    } else if (
      player1SelectedItem?.itemId !== 5 &&
      player2SelectedItem?.itemId === 5
    ) {
      return {
        player1BasePoint: 2,
        player2BasePoint: 0,
      };
    }

    return {
      player1BasePoint: basePoint,
      player2BasePoint: basePoint,
    };
  }
}
