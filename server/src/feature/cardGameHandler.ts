import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { CARD_GAME_EVENTS, ROOM_EVENTS } from "@socket-io-game/common";
import {
  Card,
  CardGameStatus,
  Item,
  PlayerStatus,
  PlayerStatuses,
} from "@socket-io-game/common";
import { Items } from "./Items";

const INITIAL_HP = 3;

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

export class CardGameHandler {
  private readonly MAX_PLAYERS = 2;
  private gameStarted: boolean = false;
  private players: Map<string, string> = new Map(); // socket.io -> userName
  private cardGameStatus: CardGameStatus = {
    playerStatuses: {},
    status: CARD_GAME_EVENTS.PENDING,
  };

  constructor(
    private io: Server<
      DefaultEventsMap,
      DefaultEventsMap,
      DefaultEventsMap,
      any
    >,
    private roomId: string
  ) {}

  canJoin(socket: Socket): boolean {
    if (this.players.size < this.MAX_PLAYERS) {
      return true;
    } else {
      socket.emit(ROOM_EVENTS.ROOM_FULL, {
        message: "このルームは満員です",
      });
      return false;
    }
  }

  setupSocket(socket: Socket, userName: string): boolean {
    this.players.set(socket.id, userName);

    socket.on(CARD_GAME_EVENTS.SELECT_CARD, (data) => {
      this.handleCardSelect(socket, data);
    });

    // 2人揃ったらゲーム開始
    if (this.players.size === this.MAX_PLAYERS) {
      this.startGame();
    }

    return true;
  }

  private startGame() {
    this.gameStarted = true;
    this.io.to(this.roomId).emit(CARD_GAME_EVENTS.START, {
      players: Array.from(this.players.values()),
    });
    // ゲーム開始時の初期化処理

    const newPlayerStatuses: PlayerStatuses = Array.from(
      this.players.keys()
    ).reduce((previousValue, currentValue) => {
      return {
        ...previousValue,
        [currentValue]: {
          userName: this.players.get(currentValue),
          hp: INITIAL_HP,
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
    this.players.clear();
    this.selectedCards.clear();
    this.gameStarted = false;
  }

  private selectedCards: SelectedCardsMap = new Map();

  handleCardSelect(socket: Socket, data: { cardId: number; itemId?: number }) {
    const playerId = socket.id;

    // プレイヤーが存在するか確認
    if (!this.players.has(playerId) || !this.gameStarted) {
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
      console.log(`selectedCard がみつかりません。`);
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
    if (this.selectedCards.size === this.MAX_PLAYERS) {
      this.resolveSelectedCards();
    }
  }

  private resolveSelectedCards() {
    const players = Array.from(this.selectedCards.entries());

    const selectedCardsInfo = players.reduce(
      (acc, [playerId, _]) => {
        const playerStatus = this.cardGameStatus.playerStatuses[playerId];
        const selectedCards = this.selectedCards.get(playerId);

        acc[playerId] = {
          playerName: playerStatus?.userName,
          card: selectedCards?.card,
          item: selectedCards?.item,
        };
        return acc;
      },
      {} as Record<
        string,
        {
          playerName?: string;
          card?: Card;
          item?: Item;
        }
      >
    );

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

    // // アイテム効果の適用
    // this.applyItemEffects();

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
      player1Id,
      player2Id,
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

    // const player1Status = this.cardGameStatus.playerStatuses[player1Id];
    // const player2Status = this.cardGameStatus.playerStatuses[player2Id];

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
    player1Id,
    player2Id,
    player1SelectedCard,
    player2SelectedCard,
    player1SelectedItem,
    player2SelectedItem,
    player1Status,
    player2Status,
  }: {
    player1Id: string;
    player2Id: string;
    player1SelectedCard: Card;
    player2SelectedCard: Card;
    player1SelectedItem?: Item;
    player2SelectedItem?: Item;
    player1Status: PlayerStatus;
    player2Status: PlayerStatus;
  }) {
    //player1 勝利時
    // if (player1SelectedCard.power > player2SelectedCard.power) {
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
