import { ALL_ITEMS, Card, Item } from "@socket-io-game/common";

export class Items {
  private INITIAL_ITEMS = [
    ALL_ITEMS.GUSU,
    ALL_ITEMS.MUKOUKA,
    ALL_ITEMS.RISKY,
    ALL_ITEMS.ABEKOBE,
    ALL_ITEMS.URAGIRI,
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
      player1SelectedItem?.itemId === ALL_ITEMS.MUKOUKA.itemId || player2SelectedItem?.itemId === ALL_ITEMS.MUKOUKA.itemId
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
      firstPlayerSelectedItem?.itemId === ALL_ITEMS.ABEKOBE.itemId &&
      secondPlayerSelectedItem?.itemId !== ALL_ITEMS.ABEKOBE.itemId
    ) {
      return true;
    } else if (
      firstPlayerSelectedItem?.itemId !== ALL_ITEMS.ABEKOBE.itemId &&
      secondPlayerSelectedItem?.itemId === ALL_ITEMS.ABEKOBE.itemId
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
    if (
      player1SelectedItem?.itemId === ALL_ITEMS.URAGIRI.itemId &&
      player2SelectedItem?.itemId === ALL_ITEMS.URAGIRI.itemId
    ) {
      return {
        player1BasePoint: 2,
        player2BasePoint: 2,
      };
    } else if (
      player1SelectedItem?.itemId === ALL_ITEMS.URAGIRI.itemId &&
      player2SelectedItem?.itemId !== ALL_ITEMS.URAGIRI.itemId
    ) {
      return {
        player1BasePoint: 0,
        player2BasePoint: 2,
      };
    } else if (
      player1SelectedItem?.itemId !== ALL_ITEMS.URAGIRI.itemId &&
      player2SelectedItem?.itemId === ALL_ITEMS.URAGIRI.itemId
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
