// roomServer.ts
import { DefaultEventsMap, Server } from "socket.io";

import { MessageHandler } from "../feature/messageHandler";
import { ROOM_EVENTS } from "../common/src/const/room";


export const roomServer = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  const rooms = new Map();
  const users = new Map();
  const messageHandler = new MessageHandler(io, users);

  io.on(ROOM_EVENTS.CONNECTION, (socket) => {
    console.log("User connected:", socket.id);

    // メッセージハンドラーのセットアップ
    messageHandler.setupMessageHandlers(socket);

    socket.on(ROOM_EVENTS.JOIN_ROOM, ({ roomId, userName }) => {
      socket.join(roomId);
      console.log(
        `${userName}：${socket.id} がルーム ${roomId} に参加しました`
      );

      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
      }
      rooms.get(roomId).add(socket.id);

      if (!users.has(socket.id)) {
        users.set(socket.id, userName);
      }
    });

    socket.on(ROOM_EVENTS.LEAVE_ROOM, (roomId) => {
      socket.leave(roomId);
      if (rooms.has(roomId)) {
        rooms.get(roomId).delete(socket.id);
        if (rooms.get(roomId).size === 0) {
          rooms.delete(roomId);
          messageHandler.cleanupRoom(roomId);
        }
        if (users.get(socket.id)) {
          users.delete(socket.id);
        }
      }
      console.log(`ユーザー ${socket.id} がルーム ${roomId} から退出しました`);
    });

    socket.on(ROOM_EVENTS.DISCONNECT, () => {
      rooms.forEach((users, roomId) => {
        if (users.has(socket.id)) {
          users.delete(socket.id);
          if (users.size === 0) {
            rooms.delete(roomId);
            messageHandler.cleanupRoom(roomId);
          }
        }
      });
      console.log(
        `ユーザー${users.get(socket.id)}:${socket.id}が切断しました。`
      );
    });
  });
};