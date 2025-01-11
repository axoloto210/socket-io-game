import { DefaultEventsMap, Server } from "socket.io";

import { ROOM_EVENTS } from "../common/src/const/room";
import { CardGameHandler } from "../feature/cardGameHandler";

export const roomServer = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  const rooms = new Map(); // roomId -> Set()
  const users = new Map(); // socket.id -> userName

  const cardGameHandlers = new Map<string, CardGameHandler>(); //roomId -> CardGameHandler

  io.on(ROOM_EVENTS.CONNECTION, (socket) => {
    console.log("User connected:", socket.id);

    socket.on(ROOM_EVENTS.JOIN_ROOM, ({ roomId, userName }) => {
      // ゲーム処理用のインスタンスを部屋ごとに作成
      let cardGameHandler = cardGameHandlers.get(roomId);

      if (!cardGameHandler) {
        cardGameHandler = new CardGameHandler(io, roomId);
        cardGameHandlers.set(roomId, cardGameHandler);
      }

      // ルームが満員でない場合のみ参加処理
      if (cardGameHandler.canJoin(socket)) {
        socket.join(roomId);
        console.log(
          `${userName}：${socket.id} がルーム ${roomId} に参加しました。`
        );
        cardGameHandler.setupSocket(socket, userName);
      } else {
        console.log(`ルーム:${roomId} は満員。`)
        return;
      }

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
      cardGameHandlers.get(roomId)?.cleanupRoom();
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

    socket.on(ROOM_EVENTS.DISCONNECT, () => {
      rooms.forEach((roomUserSet, roomId) => {
        if (roomUserSet.has(socket.id)) {
          roomUserSet.delete(socket.id);
          cardGameHandlers.get(roomId)?.cleanupRoom();
          if (roomUserSet.size === 0) {
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
