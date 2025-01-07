import { DefaultEventsMap, Server } from "socket.io";
import { ROOM_EVENTS } from "@socket-io-game/common/src/types/room";

export const roomServer = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  // ルーム管理用のMap
  const rooms = new Map();
  // ユーザー管理用のMap
  // const users = new Map();

  const messages: any = [];

  io.on(ROOM_EVENTS.CONNECTION, (socket) => {
    console.log("User connected:", socket.id);

    socket.on(ROOM_EVENTS.JOIN_ROOM, (roomId) => {
      socket.join(roomId);
      console.log(`ユーザー ${socket.id} がルーム ${roomId} に参加しました`);

      // ルーム情報を更新
      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
      }
      rooms.get(roomId).add(socket.id);
    });

    // メッセージ送信
    socket.on(ROOM_EVENTS.SEND_MESSAGE, (data) => {
      messages.push({
        roomId: data.roomId,
        message: data.message,
        sender: socket.id,
        timestamp: new Date(),
      });
      io.to(data.roomId).emit(ROOM_EVENTS.RECEIVE_MESSAGE, {
        message: data.message,
        sender: socket.id,
        timestamp: new Date(),
      });
      console.log("messages:", messages);
    });

    // ルームから退出
    socket.on(ROOM_EVENTS.LEAVE_ROOM, (roomId) => {
      socket.leave(roomId);
      if (rooms.has(roomId)) {
        rooms.get(roomId).delete(socket.id);
        if (rooms.get(roomId).size === 0) {
          rooms.delete(roomId);
        } else {
          io.to(roomId).emit("room_users", {
            roomId,
            count: rooms.get(roomId).size,
          });
        }
      }
      console.log(`ユーザー ${socket.id} がルーム ${roomId} から退出しました`);
    });

    // 切断時の処理
    socket.on(ROOM_EVENTS.DISCONNECTION, () => {
      rooms.forEach((users, roomId) => {
        if (users.has(socket.id)) {
          users.delete(socket.id);
          if (users.size === 0) {
            rooms.delete(roomId);
          } else {
            io.to(roomId).emit("room_users", {
              roomId,
              count: users.size,
            });
          }
        }
      });
      console.log("ユーザーが切断しました:", socket.id);
    });
  });
};
