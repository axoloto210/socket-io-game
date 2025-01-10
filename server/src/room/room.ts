import { DefaultEventsMap, Server } from "socket.io";
import { ROOM_EVENTS } from "@socket-io-game/common/src/const/room";
import { Message } from "@socket-io-game/common/src/types";

export const roomServer = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  // ルーム管理用のMap
  const rooms = new Map();

  /**
   * ユーザー管理用のMap
   * socket.idをキーとして、対応するユーザー名を格納する。
   */
  const users = new Map();

  const messages: Map<string, Message[]> = new Map();

  io.on(ROOM_EVENTS.CONNECTION, (socket) => {
    console.log("User connected:", socket.id);

    socket.on(ROOM_EVENTS.JOIN_ROOM, ({ roomId, userName }) => {
      socket.join(roomId);
      console.log(
        `${userName}：${socket.id} がルーム ${roomId} に参加しました`
      );

      // ルーム情報を更新
      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
      }
      rooms.get(roomId).add(socket.id);

      // ユーザー情報を更新
      if (!users.has(socket.id)) {
        users.set(socket.id, userName);
      }
    });

    // メッセージ送信
    socket.on(ROOM_EVENTS.SEND_MESSAGE, (data) => {
      if (!messages.has(data.roomId)) {
        messages.set(data.roomId, []);
      }
      (messages.get(data.roomId) as Message[]).push({
        roomId: data.roomId,
        userName: users.get(socket.id) ?? "不明",
        message: data.message,
        sender: socket.id,
        timestamp: new Date(),
      });
      io.to(data.roomId).emit(ROOM_EVENTS.RECEIVE_MESSAGE, messages.get(data.roomId));
    });

    // ルームから退出
    socket.on(ROOM_EVENTS.LEAVE_ROOM, (roomId) => {
      socket.leave(roomId);
      if (rooms.has(roomId)) {
        rooms.get(roomId).delete(socket.id);
        if (rooms.get(roomId).size === 0) {
          rooms.delete(roomId);
        }
        if (users.get(socket.id)) {
          users.delete(socket.id);
        }
      }
      console.log(`ユーザー ${socket.id} がルーム ${roomId} から退出しました`);
    });

    // 切断時の処理
    socket.on(ROOM_EVENTS.DISCONNECT, () => {
      rooms.forEach((users, roomId) => {
        if (users.has(socket.id)) {
          users.delete(socket.id);
          if (users.size === 0) {
            rooms.delete(roomId);
          }
        }
      });
      console.log(
        `ユーザー${users.get(socket.id)}:${socket.id}が切断しました。`
      );
    });
  });
};
