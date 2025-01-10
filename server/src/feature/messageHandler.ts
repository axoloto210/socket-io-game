// messageHandler.ts
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ROOM_EVENTS } from "@socket-io-game/common/src/const/room";
import { Message } from "@socket-io-game/common/src/types";

export class MessageHandler {
  private messages: Map<string, Message[]> = new Map();

  constructor(
    private io: Server<
      DefaultEventsMap,
      DefaultEventsMap,
      DefaultEventsMap,
      any
    >,
    private users: Map<string, string>
  ) {}

  setupMessageHandlers(socket: Socket) {
    socket.on(ROOM_EVENTS.SEND_MESSAGE, (data) =>
      this.handleMessage(socket, data)
    );
  }

  private handleMessage(
    socket: Socket,
    data: { roomId: string; message: string }
  ) {
    if (!this.messages.has(data.roomId)) {
      this.messages.set(data.roomId, []);
    }

    const newMessage: Message = {
      roomId: data.roomId,
      userName: this.users.get(socket.id) ?? "不明",
      message: data.message,
      sender: socket.id,
      timestamp: new Date(),
    };

    this.messages.get(data.roomId)?.push(newMessage);
    this.broadcastMessage(data.roomId);
  }

  private broadcastMessage(roomId: string) {
    this.io
      .to(roomId)
      .emit(ROOM_EVENTS.RECEIVE_MESSAGE, this.messages.get(roomId));
  }

  // メッセージの取得メソッド
  getMessages(roomId: string): Message[] {
    return this.messages.get(roomId) ?? [];
  }

  // ルーム削除時のクリーンアップ
  cleanupRoom(roomId: string) {
    this.messages.delete(roomId);
  }
}
