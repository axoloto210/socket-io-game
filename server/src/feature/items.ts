import { ALL_ITEMS, Card, Item, PlayerStatus } from "@socket-io-game/common";

export class Items {
  private INITIAL_ITEMS = [
    ALL_ITEMS.GUSU,
    ALL_ITEMS.MUKOUKA,
    ALL_ITEMS.RISKY,
    ALL_ITEMS.ABEKOBE,
    ALL_ITEMS.URAGIRI,
  ] as const satisfies Item[];

  private INITIAL_FIXED_DELUXE_ITEMS = [ALL_ITEMS.ABEKOBE, ALL_ITEMS.KOURIN];

  private INITIAL_DELUXE_ITEMS = [
    ALL_ITEMS.GUSU,
    ALL_ITEMS.MUKOUKA,
    ALL_ITEMS.RISKY,
    ALL_ITEMS.URAGIRI,
    ALL_ITEMS.TENTEKI,
    ALL_ITEMS.OUEN,
  ] as const satisfies Item[];

  private KOURIN_ITEMS = [
    ALL_ITEMS.KOURIN_YUIGA_DOKUSON,
    ALL_ITEMS.KOURIN_SINRYU,
    ALL_ITEMS.KOURIN_ZENCHI_ZENNOU,
  ] as const satisfies Item[];

  private decidedDeluxeItems: Item[] = [];

  getInitialItems() {
    return structuredClone(this.INITIAL_ITEMS);
  }

  getInitialDxItems() {
    if (this.decidedDeluxeItems.length > 0) {
      const decidedItemIds = this.decidedDeluxeItems.map((item) => {
        return item.itemId;
      });
      const restItems = structuredClone(this.INITIAL_DELUXE_ITEMS.filter((item) => {
        return !decidedItemIds.includes(item.itemId);
      }));

      return [
        ...structuredClone(this.INITIAL_FIXED_DELUXE_ITEMS),
        ...restItems,
      ];
    }

    const dxItems = structuredClone(this.INITIAL_DELUXE_ITEMS);

    // Fisher-Yatesアルゴリズムでシャッフル
    for (let i = dxItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [dxItems[i], dxItems[j]] = [dxItems[j], dxItems[i]];
    }

    // 最初の3つの要素を返す
    const randomDeluxeItems = dxItems.slice(0, 3);
    const initialItems = [
      ...structuredClone(this.INITIAL_FIXED_DELUXE_ITEMS),
      ...randomDeluxeItems,
    ];

    if (this.decidedDeluxeItems.length === 0) {
      this.decidedDeluxeItems = randomDeluxeItems;
    }

    return initialItems;
  }

  getKourinItems() {
    const kourinItems = structuredClone(this.KOURIN_ITEMS);

    // Fisher-Yatesアルゴリズムでシャッフル
    for (let i = kourinItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [kourinItems[i], kourinItems[j]] = [kourinItems[j], kourinItems[i]];
    }

    // 最初の2つの要素を返す
    return kourinItems.slice(0, 2);
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

  changeToKourinItems(player1Status: PlayerStatus) {
    player1Status.items = this.getKourinItems();
  }

  isFirstPlayerWinByYuigaDokuson({
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
      firstPlayerSelectedItem?.itemId ===
        ALL_ITEMS.KOURIN_YUIGA_DOKUSON.itemId &&
      secondPlayerSelectedItem?.itemId === ALL_ITEMS.KOURIN_YUIGA_DOKUSON.itemId
    ) {
      if (firstPlayerSelectedCard.power > secondPlayerSelectedCard.power) {
        return "win";
      } else if (
        firstPlayerSelectedCard.power < secondPlayerSelectedCard.power
      ) {
        return "lose";
      } else {
        return "draw";
      }
    } else if (
      firstPlayerSelectedItem?.itemId ===
        ALL_ITEMS.KOURIN_YUIGA_DOKUSON.itemId &&
      secondPlayerSelectedItem?.itemId !== ALL_ITEMS.KOURIN_YUIGA_DOKUSON.itemId
    ) {
      if (firstPlayerSelectedCard.power !== secondPlayerSelectedCard.power) {
        return "win";
      } else {
        return "lose";
      }
    } else if (
      firstPlayerSelectedItem?.itemId !==
        ALL_ITEMS.KOURIN_YUIGA_DOKUSON.itemId &&
      secondPlayerSelectedItem?.itemId === ALL_ITEMS.KOURIN_YUIGA_DOKUSON.itemId
    ) {
      if (firstPlayerSelectedCard.power === secondPlayerSelectedCard.power) {
        return "win";
      } else {
        return "lose";
      }
    }
    return "no_effect";
  }

  applySinryuEffect(player1SelectedCard: Card) {
    player1SelectedCard.power += 2;
  }

  applySinryuDamage({
    loserStatus,
    winnerSelectedItem,
    winnerSelectedCard,
    loserSelectedCard,
  }: {
    loserStatus: PlayerStatus;
    winnerSelectedItem?: Item;
    winnerSelectedCard: Card;
    loserSelectedCard: Card;
  }) {
    if (winnerSelectedItem?.itemId !== ALL_ITEMS.KOURIN_SINRYU.itemId) {
      return;
    }
    const additionalDamage = Math.max(
      Math.ceil(
        Math.abs(winnerSelectedCard.power - loserSelectedCard.power) / 2
      ) - 1,
      0
    );

    loserStatus.hp -= additionalDamage;
  }

  applyZenchiZennouEffect(
    player1Status: PlayerStatus,
    player2Status: PlayerStatus
  ) {
    player1Status.hp += 1;

    const tmp = player2Status.hands;
    player2Status.hands = player1Status.hands;
    player1Status.hands = tmp;
  }
}
