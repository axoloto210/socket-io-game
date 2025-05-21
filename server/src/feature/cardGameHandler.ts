import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { CARD_GAME_EVENTS, MAX_HP, ROOM_EVENTS } from "@socket-io-game/common";
import {
  Card,
  CardGameStatus,
  Item,
  PlayerStatus,
  PlayerStatuses,
} from "@socket-io-game/common";
import { Items } from "./items";

const INITIAL_HANDS: Card[] = [
  {
    cardId: 1,
    power: 1,
  },
  {
    cardId: 2,
    power: 2,
  },
  {
    cardId: 3,
    power: 3,
  },
  {
    cardId: 4,
    power: 4,
  },
  {
    cardId: 5,
    power: 5,
  },
] as const;

type Cards = { card: Card; item?: Item };

type SelectedCardsMap = Map<string, Cards>;

const items = new Items();

const BOT_NAME = "BOT🤖";

interface CardGameHandlerConfig {
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
  roomId: string;
  isBotMatch?: boolean;
}

export class CardGameHandler {
  private io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
  private roomId: string;
  private isBotMatch: boolean;
  private botId?: string;
  private readonly maxPlayers: number = 2;
  private gameStarted: boolean = false;
  private playerMap: Map<string, string> = new Map(); // socket.io -> userName
  private cardGameStatus: CardGameStatus = {
    playerStatuses: {},
    status: CARD_GAME_EVENTS.PENDING,
  };

  constructor(config: CardGameHandlerConfig) {
    const { io, roomId, isBotMatch = false } = config;
    this.io = io;
    this.roomId = roomId;
    this.isBotMatch = isBotMatch;
    if (isBotMatch) {
      this.maxPlayers = 1;
      this.botId = "botId-" + this.roomId;
    }
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

  setupSocket(socket: Socket, userName: string): boolean {
    this.playerMap.set(socket.id, userName);

    socket.on(CARD_GAME_EVENTS.SELECT_CARD, (data) => {
      this.handleCardSelect({ socketId: socket.id, data, isBot: false });
    });

    // 2人揃ったらゲーム開始
    if (this.playerMap.size === this.maxPlayers) {
      this.startGame();
    }

    return true;
  }

  setupBotMatchSocket(socket: Socket, userName: string): boolean {
    if (!this.isBotMatch) {
      return false;
    }
    this.playerMap.set(socket.id, userName);
    this.playerMap.set(this.botId!, BOT_NAME);

    socket.on(CARD_GAME_EVENTS.SELECT_CARD, (data) => {
      this.handleCardSelect({ socketId: socket.id, data, isBot: false });
    });

    this.startGame();

    return true;
  }

  /**
   * Botにカード選択を行わせる
   */
  private scheduleBotMove() {
    if (this.botId && this.gameStarted) {
      const botStatus = this.cardGameStatus.playerStatuses[this.botId];
      if (botStatus && botStatus.hands.length > 0) {
        // ランダムに手札から1枚選択
        const randomCardIndex = Math.floor(
          Math.random() * botStatus.hands.length
        );
        const randomCard = botStatus.hands[randomCardIndex];

        let itemId = undefined;
        if (botStatus.items.length > 0) {
          const randomItemIndex = Math.floor(
            Math.random() * botStatus.items.length
          );
          itemId = botStatus.items[randomItemIndex].itemId;
        }

        this.handleCardSelect({
          socketId: this.botId,
          data: {
            cardId: randomCard.cardId,
            itemId,
          },
          isBot: true,
        });
      }
    }
  }

  private startGame() {
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
          hp: MAX_HP,
          hands: structuredClone(INITIAL_HANDS),
          items: structuredClone(items.getInitialItems()),
        },
      };
    }, {});
    this.cardGameStatus = {
      status: CARD_GAME_EVENTS.START,
      playerStatuses: newPlayerStatuses,
    };

    this.sendGameStatusToClient();
    // Botにカード選択を行わせる。
    if (this.isBotMatch) {
      this.scheduleBotMove();
    }
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

  private selectedCards: SelectedCardsMap = new Map();

  handleCardSelect({
    socketId,
    data,
    isBot,
  }: {
    socketId: string;
    data: { cardId: number; itemId?: number };
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
    const selectedCard = playerStatus?.hands.find(
      (card) => card.cardId === data.cardId
    );
    const selectedItem = playerStatus?.items.find(
      (item) => item.itemId === data.itemId
    );

    // 選択したカードが手札に存在しない場合は処理しない
    if (!selectedCard) {
      return;
    }

    // カードの選択を保存
    this.selectedCards.set(playerId, {
      card: selectedCard,
      item: selectedItem,
    });

    // 選択したカードを手札から削除
    playerStatus.hands = playerStatus.hands.filter(
      (card) => card.cardId !== data.cardId
    );
    // 選択したアイテムを手札から削除
    playerStatus.items = playerStatus.items.filter(
      (item) => item.itemId !== data.itemId
    );

    // 全プレイヤーがカードを選択したか確認
    //Bot戦の場合はBotが選択済みかも確認する
    if (
      this.isBotMatch
        ? this.selectedCards.size === this.maxPlayers + 1
        : this.selectedCards.size === this.maxPlayers
    ) {
      this.resolveSelectedCards();
    }
  }

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
    if (this.isBotMatch) {
      this.scheduleBotMove();
    }
  }

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
      items.isMukouEffect(player1SelectedItem, player2SelectedItem) ||
      (player1SelectedItem == null && player2SelectedItem == null)
    ) {
      return;
    }

    // グウスウ
    if (player1SelectedItem?.itemId === 1) {
      items.applyGusuEffect(player1SelectedCard, player2SelectedCard);
    }
    if (player2SelectedItem?.itemId === 1) {
      items.applyGusuEffect(player1SelectedCard, player2SelectedCard);
    }

    // リスキー
    if (player1SelectedItem?.itemId === 3) {
      items.applyRiskyEffect(player1SelectedCard);
    }
    if (player2SelectedItem?.itemId === 3) {
      items.applyRiskyEffect(player2SelectedCard);
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
      if (items.isMukouEffect(player1SelectedItem, player2SelectedItem)) {
        return;
      }

      // アイテム処理
      // リスキー
      if (player1SelectedItem?.itemId === 3) {
        player2Status.hp -= 1;
        if (player2Status.hp < 0) {
          player2Status.hp = 0;
        }
      }
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
      if (items.isMukouEffect(player1SelectedItem, player2SelectedItem)) {
        return;
      }

      // アイテム処理
      // リスキー
      if (player2SelectedItem?.itemId === 3) {
        player1Status.hp -= 1;
        if (player1Status.hp < 0) {
          player1Status.hp = 0;
        }
      }
    } // 引き分け時
    else {
      let basePoint = 1;

      if (items.isMukouEffect(player1SelectedItem, player2SelectedItem)) {
        player1Status.hp -= basePoint;
        player2Status.hp -= basePoint;
        return;
      }
      const { player1BasePoint, player2BasePoint } = items.getDrawBasePoint(
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
    if (
      items.isMukouEffect(firstPlayerSelectedItem, secondPlayerSelectedItem)
    ) {
      if (firstPlayerSelectedCard.power > secondPlayerSelectedCard.power) {
        return true;
      } else {
        return false;
      }
    }

    if (items.isAbekobe(firstPlayerSelectedItem, secondPlayerSelectedItem)) {
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
