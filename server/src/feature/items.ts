import { ALL_ITEMS, Card, Item, PlayerStatus } from "@socket-io-game/common";

export class Items {
  private INITIAL_ITEMS = [
    ALL_ITEMS.GUSU,
    ALL_ITEMS.MUKOUKA,
    ALL_ITEMS.RISKY,
    ALL_ITEMS.ABEKOBE,
    ALL_ITEMS.URAGIRI,
  ] as const satisfies Item[];

  private INITIAL_DX_ITEMS = [
    ALL_ITEMS.GUSU,
    ALL_ITEMS.MUKOUKA,
    ALL_ITEMS.RISKY,
    ALL_ITEMS.ABEKOBE,
    ALL_ITEMS.URAGIRI,
    ALL_ITEMS.TENTEKI,
    ALL_ITEMS.OUEN,
  ];

  getInitialItems() {
    return structuredClone(this.INITIAL_ITEMS);
  }

  getInitialDxItems() {
    const dxItems = structuredClone(this.INITIAL_DX_ITEMS);

    // Fisher-Yatesアルゴリズムでシャッフル
    for (let i = dxItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [dxItems[i], dxItems[j]] = [dxItems[j], dxItems[i]];
    }

    // 最初の5つの要素を返す
    return dxItems.slice(0, 5);
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
      player1SelectedItem?.itemId === ALL_ITEMS.MUKOUKA.itemId ||
      player2SelectedItem?.itemId === ALL_ITEMS.MUKOUKA.itemId
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

  isFirstPlayerWinByTenteki({
    firstPlayerSelectedCard,
    secondPlayerSelectedCard,
    firstPlayerSelectedItem,
    secondPlayerSelectedItem,
  }: {
    firstPlayerSelectedCard: Card;
    secondPlayerSelectedCard: Card;
    firstPlayerSelectedItem: Item | undefined;
    secondPlayerSelectedItem: Item | undefined;
  }): "win" | "lose" | "no_effect" | "draw" {
    if (
      firstPlayerSelectedItem?.itemId === ALL_ITEMS.TENTEKI.itemId &&
      secondPlayerSelectedItem?.itemId !== ALL_ITEMS.TENTEKI.itemId &&
      Math.abs(
        firstPlayerSelectedCard.power - secondPlayerSelectedCard.power
      ) === 2
    ) {
      return "win";
    } else if (
      firstPlayerSelectedItem?.itemId !== ALL_ITEMS.TENTEKI.itemId &&
      secondPlayerSelectedItem?.itemId === ALL_ITEMS.TENTEKI.itemId &&
      Math.abs(
        firstPlayerSelectedCard.power - secondPlayerSelectedCard.power
      ) === 2
    ) {
      return "lose";
    } else if (
      firstPlayerSelectedItem?.itemId === ALL_ITEMS.TENTEKI.itemId &&
      secondPlayerSelectedItem?.itemId === ALL_ITEMS.TENTEKI.itemId &&
      Math.abs(
        firstPlayerSelectedCard.power - secondPlayerSelectedCard.power
      ) === 2
    ) {
      return "draw";
    } else {
      return "no_effect";
    }
  }

  isDoubleTenteki({
    player1SelectedCard,
    player2SelectedCard,
    player1SelectedItem,
    player2SelectedItem,
  }: {
    player1SelectedCard: Card;
    player2SelectedCard: Card;
    player1SelectedItem?: Item;
    player2SelectedItem?: Item;
  }) {
    if (
      player1SelectedItem?.itemId !== ALL_ITEMS.TENTEKI.itemId ||
      player2SelectedItem?.itemId !== ALL_ITEMS.TENTEKI.itemId
    ) {
      return false;
    }
    if (Math.abs(player1SelectedCard.power - player2SelectedCard.power) === 2) {
      return true;
    }
    return false;
  }

  /**
   * 場に出したカードパワーの差が2のときに、loserの手札のカードパワーを下げる。
   */
  applyTentekiEffectToCards({
    loserStatus,
    winnerSelectedCard,
    loserSelectedCard,
    winnerSelectedItem,
  }: {
    loserStatus: PlayerStatus;
    winnerSelectedCard: Card;
    loserSelectedCard: Card;
    winnerSelectedItem?: Item;
  }) {
    if (winnerSelectedItem?.itemId === ALL_ITEMS.TENTEKI.itemId) {
      if (Math.abs(winnerSelectedCard.power - loserSelectedCard.power) === 2) {
        loserStatus.hands.forEach((card) => {
          card.power--;
        });
      }
    }
  }

  /**
   * 手札のパワーを+1。3と一緒に使用したときにはさらに+1。
   */
  applyOuenEffectToCards(playerStatus: PlayerStatus, selectedCard: Card) {
    playerStatus.hands.forEach((card) => {
      card.power++;
    });
    if (selectedCard.power === 3) {
      playerStatus.hands.forEach((card) => {
        card.power++;
      });
    }
  }
}
