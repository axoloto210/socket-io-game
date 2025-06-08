import { Server, Socket } from "socket.io";
import {
  ALL_ITEMS,
  CARD_GAME_EVENTS,
  MAX_HP,
  isRestrictedPair,
  ROOM_EVENTS,
  DecidedCardAndItem,
} from "@socket-io-game/common";
import {
  Card,
  CardGameStatus,
  Item,
  PlayerStatus,
  PlayerStatuses,
} from "@socket-io-game/common";
import { Items } from "./items";

type Cards = { card: Card; item?: Item };

type SelectedCardsMap = Map<string, Cards>;

export interface CardGameHandlerConfig {
  io: Server;
  roomId: string;
  maxHp?: number;
}

export abstract class BaseCardGameHandler {
  protected io: Server;
  protected roomId: string;
  protected gameStarted: boolean = false;
  protected playerMap: Map<string, string> = new Map(); // socket.io -> userName
  protected cardGameStatus: CardGameStatus = {
    playerStatuses: {},
    status: CARD_GAME_EVENTS.PENDING,
  };
  protected botId: string = "";
  protected items: Items;
  protected maxHp: number;

  protected abstract readonly maxPlayers: number;
  protected abstract readonly initialCards: Card[];
  constructor(config: CardGameHandlerConfig) {
    const { io, roomId } = config;
    this.io = io;
    this.roomId = roomId;
    this.items = new Items();
    this.maxHp = config.maxHp ?? MAX_HP
  }

  canJoin(socket: Socket): boolean {
    if (this.playerMap.size < this.maxPlayers) {
      return true;
    } else {
      socket.emit(ROOM_EVENTS.ROOM_FULL, {
        message: "このルームは満員です",
      });
      return false;
    }
  }

  abstract setupSocket(socket: Socket, userName: string): boolean;

  abstract getInitialItems(): Item[];

  protected startGame() {
    this.gameStarted = true;
    this.io.to(this.roomId).emit(CARD_GAME_EVENTS.START, {
      players: Array.from(this.playerMap.values()),
    });
    // ゲーム開始時の初期化処理

    const newPlayerStatuses: PlayerStatuses = Array.from(
      this.playerMap.keys()
    ).reduce((previousValue, currentValue) => {
      return {
        ...previousValue,
        [currentValue]: {
          userName: this.playerMap.get(currentValue),
          hp: this.maxHp,
          hands: structuredClone(this.initialCards),
          items: structuredClone(this.getInitialItems()), //TODO:モードによって分けられるよう引数を持たせる。
        },
      };
    }, {});
    this.cardGameStatus = {
      status: CARD_GAME_EVENTS.START,
      playerStatuses: newPlayerStatuses,
    };

    this.sendGameStatusToClient();
    this.onGameStart();
  }

  sendGameStatusToClient() {
    this.io
      .to(this.roomId)
      .emit(CARD_GAME_EVENTS.RECEIVE_CARD_GAME, this.cardGameStatus);
  }

  cleanupRoom() {
    this.io.to(this.roomId).emit(ROOM_EVENTS.ROOM_DISMISS, {
      message: `部屋:${this.roomId}が解散されました。`,
    });
    this.playerMap.clear();
    this.selectedCards.clear();
    this.gameStarted = false;
  }

  protected selectedCards: SelectedCardsMap = new Map();

  handleCardSelect({
    socketId,
    decidedCardAndItem,
    isBot,
  }: {
    socketId: string;
    decidedCardAndItem: DecidedCardAndItem;
    isBot: boolean;
  }) {
    const playerId = isBot ? this.botId! : socketId;

    // プレイヤーが存在するか確認
    if (!this.playerMap.has(playerId) || !this.gameStarted) {
      return;
    }

    // 既に選択済みの場合は処理しない
    if (this.selectedCards.has(playerId)) {
      return;
    }

    const playerStatus = this.cardGameStatus.playerStatuses[playerId];
    const selectedCard = playerStatus.hands.find((card) => {
      return card.cardId === decidedCardAndItem.card.cardId;
    });

    if (selectedCard === undefined) {
      console.error("カード未選択によるエラーが発生");
      return;
    }

    let selectedItem = playerStatus.items.find((item) => {
      return item.itemId === decidedCardAndItem.itemId;
    });

    // 選択したカードとアイテムの組が制約に違反している場合には、アイテムを選択していないこととする。
    if (
      isRestrictedPair({
        power: selectedCard.power,
        itemId: selectedItem?.itemId,
      })
    ) {
      selectedItem = undefined;
    }

    // カードの選択を保存
    this.selectedCards.set(playerId, {
      card: selectedCard,
      item: selectedItem,
    });

    // 選択したカードを手札から削除
    playerStatus.hands = playerStatus.hands.filter((card) => {
      return card.cardId !== selectedCard.cardId;
    });
    // 選択したアイテムを手札から削除
    playerStatus.items = playerStatus.items.filter((item) => {
      return item.itemId !== selectedItem?.itemId;
    });

    if (this.isAllPlayerSelected()) {
      this.onGameStart();
      this.resolveSelectedCards();
    }
  }

  // 全プレイヤーがカードを選択したか確認
  //Bot戦の場合はBotが選択済みかも確認する
  protected isAllPlayerSelected() {
    return this.selectedCards.size === this.maxPlayers;
  }

  protected onGameStart(): void {}

  private resolveSelectedCards() {
    const players = Array.from(this.selectedCards.entries());

    const selectedCardsInfo = players.reduce<
      Record<
        string,
        {
          playerName?: string;
          card?: Card;
          item?: Item;
        }
      >
    >((acc, [playerId, _]) => {
      const playerStatus = this.cardGameStatus.playerStatuses[playerId];
      const selectedCards = this.selectedCards.get(playerId);

      acc[playerId] = {
        playerName: playerStatus?.userName,
        card: selectedCards?.card,
        item: selectedCards?.item,
      };
      return acc;
    }, {});

    // カードゲームのステータスを更新
    this.cardGameStatus = {
      ...this.cardGameStatus,
      status: CARD_GAME_EVENTS.SHOWING_SELECTED_CARDS,
      selectedCards: selectedCardsInfo,
    };

    this.sendGameStatusToClient();

    setTimeout(() => {
      this.resolveRound();
    }, 5000);
  }

  private resolveRound() {
    const players = Array.from(this.selectedCards.entries());
    const [
      [player1Key, player1SelectedCards],
      [player2Key, player2SelectedCards],
    ] = players;

    if (!player1SelectedCards || !player2SelectedCards) {
      return;
    }

    // 勝敗判定
    this.determineBattleResult(
      player1Key,
      player2Key,
      player1SelectedCards,
      player2SelectedCards
    );

    // 次のラウンドの準備
    this.selectedCards.clear();
    this.cardGameStatus = {
      ...this.cardGameStatus,
      selectedCards: {},
      status:
        this.cardGameStatus.status === CARD_GAME_EVENTS.GAME_END
          ? CARD_GAME_EVENTS.GAME_END
          : CARD_GAME_EVENTS.RESOLVE,
    };
    this.sendGameStatusToClient();
    this.onRoundEnd();
  }

  protected onRoundEnd(): void {}

  private determineBattleResult(
    player1Id: string,
    player2Id: string,
    player1Cards: Cards,
    player2Cards: Cards
  ) {
    const player1Status = this.cardGameStatus.playerStatuses[player1Id];
    const player2Status = this.cardGameStatus.playerStatuses[player2Id];

    const { card: player1SelectedCard, item: player1SelectedItem } =
      player1Cards;
    const { card: player2SelectedCard, item: player2SelectedItem } =
      player2Cards;

    this.applyItemEffects({
      player1SelectedCard,
      player2SelectedCard,
      player1SelectedItem,
      player2SelectedItem,
    });

    //カードの勝敗判定とダメージ適用
    this.applyDamage({
      player1SelectedCard,
      player2SelectedCard,
      player1SelectedItem,
      player2SelectedItem,
      player1Status,
      player2Status,
    });

    // 手札へのパワー増減効果を適用
    this.applyItemEffectsToCards({
      player1Status,
      player2Status,
      player1SelectedCard,
      player2SelectedCard,
      player1SelectedItem,
      player2SelectedItem,
    });

    // ゲームの勝敗判定
    if (player1Status.hp <= 0 || player2Status.hp <= 0) {
      this.cardGameStatus.status = CARD_GAME_EVENTS.GAME_END;
    }
  }

  private applyItemEffects({
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
    // アイテム処理を行わないケース
    if (
      this.items.isMukouEffect(player1SelectedItem, player2SelectedItem) ||
      (player1SelectedItem == null && player2SelectedItem == null)
    ) {
      return;
    }

    if (player1SelectedItem?.itemId === ALL_ITEMS.GUSU.itemId) {
      this.items.applyGusuEffect(player1SelectedCard, player2SelectedCard);
    }
    if (player2SelectedItem?.itemId === ALL_ITEMS.GUSU.itemId) {
      this.items.applyGusuEffect(player1SelectedCard, player2SelectedCard);
    }

    if (player1SelectedItem?.itemId === ALL_ITEMS.RISKY.itemId) {
      this.items.applyRiskyEffect(player1SelectedCard);
    }
    if (player2SelectedItem?.itemId === ALL_ITEMS.RISKY.itemId) {
      this.items.applyRiskyEffect(player2SelectedCard);
    }
  }

  private applyItemEffectsToCards({
    player1Status,
    player2Status,
    player1SelectedCard,
    player2SelectedCard,
    player1SelectedItem,
    player2SelectedItem,
  }: {
    player1Status: PlayerStatus;
    player2Status: PlayerStatus;
    player1SelectedCard: Card;
    player2SelectedCard: Card;
    player1SelectedItem?: Item;
    player2SelectedItem?: Item;
  }) {
    if (player1SelectedItem?.itemId === ALL_ITEMS.OUEN.itemId) {
      this.items.applyOuenEffectToCards(player1Status, player1SelectedCard);
    }
    if (player2SelectedItem?.itemId === ALL_ITEMS.OUEN.itemId) {
      this.items.applyOuenEffectToCards(player2Status, player2SelectedCard);
    }
  }

  private applyDamage({
    player1SelectedCard,
    player2SelectedCard,
    player1SelectedItem,
    player2SelectedItem,
    player1Status,
    player2Status,
  }: {
    player1SelectedCard: Card;
    player2SelectedCard: Card;
    player1SelectedItem?: Item;
    player2SelectedItem?: Item;
    player1Status: PlayerStatus;
    player2Status: PlayerStatus;
  }) {
    //player1 勝利時
    if (
      this.isFirstPlayerWin({
        firstPlayerSelectedCard: player1SelectedCard,
        firstPlayerSelectedItem: player1SelectedItem,
        secondPlayerSelectedCard: player2SelectedCard,
        secondPlayerSelectedItem: player2SelectedItem,
      })
    ) {
      player2Status.hp -= 1;
      // ムコウカ
      if (this.items.isMukouEffect(player1SelectedItem, player2SelectedItem)) {
        return;
      }

      // アイテム処理
      // リスキー
      if (player1SelectedItem?.itemId === ALL_ITEMS.RISKY.itemId) {
        player2Status.hp -= 1;
        if (player2Status.hp < 0) {
          player2Status.hp = 0;
        }
      }
      //　テンテキ
      this.items.applyTentekiEffectToCards({
        loserStatus: player2Status,
        winnerSelectedCard: player1SelectedCard,
        loserSelectedCard: player2SelectedCard,
        winnerSelectedItem: player1SelectedItem,
      });
    } // player2 勝利時
    else if (
      this.isFirstPlayerWin({
        firstPlayerSelectedCard: player2SelectedCard,
        firstPlayerSelectedItem: player2SelectedItem,
        secondPlayerSelectedCard: player1SelectedCard,
        secondPlayerSelectedItem: player1SelectedItem,
      })
    ) {
      player1Status.hp -= 1;
      // ムコウカ
      if (this.items.isMukouEffect(player1SelectedItem, player2SelectedItem)) {
        return;
      }

      // アイテム処理
      // リスキー
      if (player2SelectedItem?.itemId === ALL_ITEMS.RISKY.itemId) {
        player1Status.hp -= 1;
        if (player1Status.hp < 0) {
          player1Status.hp = 0;
        }
      }

      // テンテキ
      this.items.applyTentekiEffectToCards({
        loserStatus: player1Status,
        winnerSelectedCard: player2SelectedCard,
        loserSelectedCard: player1SelectedCard,
        winnerSelectedItem: player2SelectedItem,
      });
    } // 引き分け時
    else {
      let basePoint = 1;

      // ムコウカ
      if (this.items.isMukouEffect(player1SelectedItem, player2SelectedItem)) {
        player1Status.hp -= basePoint;
        player2Status.hp -= basePoint;
        return;
      }

      // テンテキ
      if (
        this.items.isDoubleTenteki({
          player1SelectedCard,
          player2SelectedCard,
          player1SelectedItem,
          player2SelectedItem,
        })
      ) {
        this.items.applyTentekiEffectToCards({
          loserStatus: player1Status,
          winnerSelectedCard: player2SelectedCard,
          loserSelectedCard: player1SelectedCard,
          winnerSelectedItem: player2SelectedItem,
        });
        this.items.applyTentekiEffectToCards({
          loserStatus: player2Status,
          winnerSelectedCard: player1SelectedCard,
          loserSelectedCard: player2SelectedCard,
          winnerSelectedItem: player1SelectedItem,
        });

        player1Status.hp -= basePoint;
        player2Status.hp -= basePoint;
        return;
      }

      const { player1BasePoint, player2BasePoint } =
        this.items.getDrawBasePoint(
          basePoint,
          player1SelectedItem,
          player2SelectedItem
        );

      player1Status.hp -= player1BasePoint;
      player2Status.hp -= player2BasePoint;
    }
  }

  /**
   * 引数に渡したfirstPlayerがラウンドで勝った時には真。
   * @param param0
   * @returns
   */
  private isFirstPlayerWin({
    firstPlayerSelectedCard,
    secondPlayerSelectedCard,
    firstPlayerSelectedItem,
    secondPlayerSelectedItem,
  }: {
    firstPlayerSelectedCard: Card;
    secondPlayerSelectedCard: Card;
    firstPlayerSelectedItem?: Item;
    secondPlayerSelectedItem?: Item;
  }): boolean {
    // ムコウカ使用時はカードパワーのみで判定
    if (
      this.items.isMukouEffect(
        firstPlayerSelectedItem,
        secondPlayerSelectedItem
      )
    ) {
      if (firstPlayerSelectedCard.power > secondPlayerSelectedCard.power) {
        return true;
      } else {
        return false;
      }
    }

    const isFirstPlayerWinByTentekiFlg = this.items.isFirstPlayerWinByTenteki({
      firstPlayerSelectedCard,
      secondPlayerSelectedCard,
      firstPlayerSelectedItem,
      secondPlayerSelectedItem,
    });
    //テンテキによる勝敗判定
    if (isFirstPlayerWinByTentekiFlg === "win") {
      return true;
    } else if (isFirstPlayerWinByTentekiFlg === "lose") {
      return false;
    } else if (isFirstPlayerWinByTentekiFlg === "draw") {
      return false;
    }

    // アベコベによる勝敗判定。テンテキに無効化される。
    if (
      this.items.isAbekobe(firstPlayerSelectedItem, secondPlayerSelectedItem)
    ) {
      if (firstPlayerSelectedCard.power < secondPlayerSelectedCard.power) {
        return true;
      } else {
        return false;
      }
    } else {
      if (firstPlayerSelectedCard.power > secondPlayerSelectedCard.power) {
        return true;
      } else {
        return false;
      }
    }
  }
}
