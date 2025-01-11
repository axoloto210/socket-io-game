import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ROOM_EVENTS } from "../common/src/const/room";
// import { CARD_GAME_EVENTS } from "../common/src/const/room";
// import { Card, CardGameStatus } from "../common/src/types";

// const INITIAL_HP = 3;

// const INITIAL_HANDS: Card[] = [
//   {
//     cardId: 1,
//     power: 1,
//   },
//   {
//     cardId: 2,
//     power: 2,
//   },
//   {
//     cardId: 3,
//     power: 3,
//   },
//   {
//     cardId: 4,
//     power: 4,
//   },
//   {
//     cardId: 5,
//     power: 5,
//   },
// ];
// はら：場の偶数のパワーを+2するアイテム
// はら：相手の効果を無効
// はら：このターンのパワー-2、勝ったら2ダメージ
export class CardGameHandler {
  private readonly MAX_PLAYERS = 2;
  private gameStarted: boolean = false;
  private players: Map<string, string> = new Map(); // socket.io -> userName

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
    console.log("playser:", this.players);
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


    // 2人揃ったらゲーム開始
    if (this.players.size === this.MAX_PLAYERS) {
      this.startGame();
    }

    return true;
  }

  private startGame() {
    this.gameStarted = true;
    this.io.to(this.roomId).emit("gameStart", {
      players: Array.from(this.players.values()),
    });
    // ゲーム開始時の初期化処理
  }

  cleanupRoom() {
    console.log(this.gameStarted)
    console.log('cleanup!!!!!!')
    this.io.to(this.roomId).emit(ROOM_EVENTS.ROOM_DISMISS, {
      message: `部屋:${this.roomId}が解散されました。`
    })
    this.players.clear();
    this.gameStarted = false;
  }

  getPlayerCount(): number {
    return this.players.size;
  }
}

// class RoomGameLogic {
// private io: Server;
// private roomId: string;
// private players: Map<string, string>; // socketId -> userName
// private readonly MAX_PLAYERS = 2;
// private gameStarted: boolean = false;

//   constructor(io: Server, roomId: string) {
//     this.io = io;
//     this.roomId = roomId;
//     this.players = new Map();
//   }

// canJoin(): boolean {
//   return this.players.size < this.MAX_PLAYERS;
// }

//   setupSocket(socket: Socket, userName: string): boolean {
//     // プレイヤー数チェック
//     if (!this.canJoin()) {
//       socket.emit('roomFull', {
//         message: 'このルームは満員です'
//       });
//       return false;
//     }

//     this.players.set(socket.id, userName);

//     // ゲーム関連のイベントハンドラー設定
//     socket.on('playCard', (cardData) => this.handlePlayCard(socket, cardData));
//     socket.on('disconnect', () => this.handlePlayerDisconnect(socket));

//     // ルーム情報を全プレイヤーに通知
//     this.broadcastRoomStatus();

//     // 2人揃ったらゲーム開始
//     if (this.players.size === this.MAX_PLAYERS) {
//       this.startGame();
//     }

//     return true;
//   }

// private broadcastRoomStatus() {
//   this.io.to(this.roomId).emit('roomStatus', {
//     currentPlayers: Array.from(this.players.entries()).map(([id, name]) => ({
//       id,
//       name
//     })),
//     playerCount: this.players.size,
//     isFull: this.players.size >= this.MAX_PLAYERS,
//     gameStarted: this.gameStarted
//   });
// }

// private startGame() {
//   this.gameStarted = true;
//   this.io.to(this.roomId).emit('gameStart', {
//     players: Array.from(this.players.values())
//   });
//   // ゲーム開始時の初期化処理
// }

//   private handlePlayerDisconnect(socket: Socket) {
//     this.players.delete(socket.id);
//     this.gameStarted = false;

//     // 他のプレイヤーに通知
//     this.io.to(this.roomId).emit('playerLeft', {
//       playerId: socket.id,
//       message: 'プレイヤーが退出しました。ゲームを中断します。'
//     });

//     this.broadcastRoomStatus();
//   }

// cleanup() {
//   this.players.clear();
//   this.gameStarted = false;
// }

// getPlayerCount(): number {
//   return this.players.size;
// }
// }
