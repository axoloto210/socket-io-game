import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { CARD_GAME_EVENTS } from "../common/src/const/room";
import { Card, CardGameStatus } from "../common/src/types";

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

export class CardGameHandler {
  private cardGameStatuses: Map<string, CardGameStatus> = new Map();

  constructor(
    private io: Server<
      DefaultEventsMap,
      DefaultEventsMap,
      DefaultEventsMap,
      any
    >,
    private users: Map<string, string>
  ) {}

  getStatus(roomId: string) {
    if (!this.cardGameStatuses.has(roomId)) {
      throw new Error();
    }

    console.log(this.users);
    return this.cardGameStatuses.get(roomId) as CardGameStatus;
  }

  setupCardGameHandlers(socket: Socket) {
    socket.on(CARD_GAME_EVENTS.PENDING, (data) =>{
        console.log('data!!!',data)
      this.handlePendingPhase(data)
    }
    );
    // socket.on(CARD_GAME_EVENTS.SELECT_CARD, (data) => {
    //   this.handleSelectPhase(socket, data);
    // });
    // socket.on(CARD_GAME_EVENTS.RESOLVE, (data) => {
    //   this.handleResolvePhase(socket, data);
    // });
    // socket.on(CARD_GAME_EVENTS.RESULT_CHECK, (data) => {
    //   this.handleResultCheckPhase(socket, data);
    // });
  }

  private handlePendingPhase(
    // socket: Socket,
    data: { roomId: string; userName: string }
  ) {

    console.log('uooooooo')
    if (!this.cardGameStatuses.has(data.roomId)) {
      this.cardGameStatuses.set(data.roomId, {
        status: CARD_GAME_EVENTS.PENDING,
        roomUsersStatus: {
          [data.userName]: {
            hp: INITIAL_HP,
            hands: INITIAL_HANDS,
          },
        },
      } as CardGameStatus);
    } else {
      const currentStatus = this.getStatus(data.roomId);
      this.cardGameStatuses.set(data.roomId, {
        status: CARD_GAME_EVENTS.START,
        roomUsersStatus: {
          ...currentStatus.roomUsersStatus,

          [data.userName]: {
            hp: INITIAL_HP,
            hands: INITIAL_HANDS,
          },
        },
      });
      if (
        Object.keys(
          this.cardGameStatuses.get(data.roomId)?.roomUsersStatus ?? {}
        ).length === 2
      ) {
        this.cardGameStatuses.set(data.roomId, {
          ...(this.cardGameStatuses.get(data.roomId) as CardGameStatus),
          status: CARD_GAME_EVENTS.START,
        });
      } else if (
        Object.keys(
          this.cardGameStatuses.get(data.roomId)?.roomUsersStatus ?? {}
        ).length > 2
      ) {
        console.log("定員オーバーです。");
      }
    }

    this.broadcastStatus(data.roomId);
  }

  private broadcastStatus(roomId: string) {
    console.log('dispatch!!!!!!!!')
    console.log(this.cardGameStatuses.get(roomId))
    this.io
      .to(roomId)
      .emit(
        CARD_GAME_EVENTS.RECEIVE_CARD_GAME,
        this.cardGameStatuses.get(roomId)
      );
  }

  //   private handleSelectPhase(socket: Socket, data: {}) {}
  //   private handleResolvePhase(socket: Socket, data: {}) {}
  //   private handleResultCheckPhase(socket: Socket, data: {}) {}

  //   // メッセージの取得メソッド
  //   getMessages(roomId: string): Message[] {
  //     return this.messages.get(roomId) ?? [];
  //   }

  // ルーム削除時のクリーンアップ
  cleanupRoom(roomId: string) {
    this.cardGameStatuses.delete(roomId);
  }
}
