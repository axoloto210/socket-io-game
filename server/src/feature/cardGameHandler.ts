import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { CARD_GAME_EVENTS, ROOM_EVENTS } from "../common/src/const/room";
import {
  Card,
  CardGameStatus,
  Item,
  PlayerStatuses,
} from "../common/src/types";

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
];

const INITIAL_ITEMS = [
  {
    itemId: 1,
    itemName: "グウスウ",
    itemEffect: "場の偶数のパワーを+2するアイテム",
  },
  {
    itemId: 2,
    itemName: "ムコウカ",
    itemEffect: "相手のアイテム効果を無効にする",
  },
  {
    itemId: 3,
    itemName: "リスキー",
    itemEffect: "このターンのパワー -2、勝ったら2ダメージ",
  },
];

type Cards = { card: Card; item?: Item };

type SelectedCardsMap = Map<string, Cards>;

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
          hands: INITIAL_HANDS,
          items: INITIAL_ITEMS,
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
    console.log(players);

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
    console.log("resolve players:", players);
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
      status: this.cardGameStatus.status === CARD_GAME_EVENTS.GAME_END ? CARD_GAME_EVENTS.GAME_END : CARD_GAME_EVENTS.RESOLVE,
    };
    this.sendGameStatusToClient();
  }

  // private applyItemEffects(
  //   playerId: string,
  //   itemId: number | undefined,
  //   card: Card
  // ) {
  //   if (!itemId) return;

  //   const playerStatus = this.cardGameStatus.playerStatuses[playerId];
  //   const item = playerStatus?.items.find((item) => item.itemId === itemId);

  //   if (!item) return;

  //   switch (item.itemId) {
  //     case 1: // グウスウ
  //       if (card.power % 2 === 0) {
  //         card.power += 2;
  //       }
  //       break;
  //     case 2: // ムコウカ
  //       // 相手のアイテム効果を無効化する処理は別途実装
  //       break;
  //     case 3: // リスキー
  //       card.power -= 2;
  //       break;
  //   }
  // }

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

    if (player1SelectedCard.power > player2SelectedCard.power) {
      player2Status.hp -= 1;
      // // リスキーの追加ダメージ
      // if (this.selectedCards.get(player1Id)?.itemId === 3) {
      //   player2Status.hp -= 1;
      // }
    } else if (player1SelectedCard.power < player2SelectedCard.power) {
      player1Status.hp -= 1;
      // // リスキーの追加ダメージ
      // if (this.selectedCards.get(player2Id)?.itemId === 3) {
      //   player1Status.hp -= 1;
      // }
    } else {
      player1Status.hp -= 1;
      player2Status.hp -= 1;
    }

    // 勝敗判定
    if (player1Status.hp <= 0 || player2Status.hp <= 0) {
      this.cardGameStatus.status = CARD_GAME_EVENTS.GAME_END;
    }
  }
}
