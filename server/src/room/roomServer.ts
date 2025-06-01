import { Server } from "socket.io";

import { ROOM_EVENTS } from "@socket-io-game/common";
import { CardGameHandler } from "../feature/cardGameHandler";
import { RandomRoomIdMaker } from "./RandomRoomIdMaker";
import { BotRoomIdMaker } from "./botRoomIdMaker";
import { BaseCardGameHandler } from "../feature/baseCardGameHandler";

// Function to setup all socket.io handlers - exported for testing
export const setupSocketHandlers = (
  io: Server
) => {
  const rooms = new Map<string, Set<string>>(); // roomId -> Set()
  const users = new Map<string, string>(); // socket.id -> userName

  const cardGameHandlers = new Map<string, BaseCardGameHandler>(); //roomId -> BaseCardGameHandler

  const randomRoomIdMaker = new RandomRoomIdMaker();

  const botRoomIdMaker = new BotRoomIdMaker();

  io.on(ROOM_EVENTS.CONNECTION, (socket) => {
    console.log("User connected:", socket.id);

    // ランダムマッチ用のroomIdを割り当てる
    socket.on(ROOM_EVENTS.ASSIGN_RANDOM_ROOM_ID, () => {
      const randomRoomId = randomRoomIdMaker.fetchRoomId();

      randomRoomIdMaker.joinRoom(socket.id);

      io.to(socket.id).emit(ROOM_EVENTS.RANDOM_ROOM_ASSIGNED, randomRoomId);
    });

    // Bot戦用のroomIdを割り当てる
    socket.on(ROOM_EVENTS.ASSIGN_BOT_ROOM_ID, () => {
      const botRoomId = botRoomIdMaker.fetchRoomId();

      io.to(socket.id).emit(ROOM_EVENTS.BOT_ROOM_ASSIGNED, botRoomId);
    });

    socket.on(ROOM_EVENTS.JOIN_ROOM, ({ roomId, userName }) => {
      // ゲーム処理用のインスタンスを部屋ごとに作成
      let cardGameHandler = cardGameHandlers.get(roomId);

      if (!cardGameHandler) {
        cardGameHandler = new CardGameHandler({ io, roomId });
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
        console.log(`ルーム:${roomId} は満員。`);
        return;
      }

      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
      }
      rooms.get(roomId)!.add(socket.id);

      if (!users.has(socket.id)) {
        users.set(socket.id, userName);
      }
    });

    // // Bot戦用のルーム参加処理
    // socket.on(ROOM_EVENTS.JOIN_BOT_ROOM, ({ roomId, userName }) => {
    //   const cardGameHandler = new CardGameHandler({
    //     io,
    //     roomId,
    //     isBotMatch: true,
    //   });
    //   cardGameHandlers.set(roomId, cardGameHandler);

    //   // ルームが満員でない場合のみ参加処理
    //   if (cardGameHandler.canJoin(socket)) {
    //     socket.join(roomId);
    //     console.log(
    //       `${userName}：${socket.id} がルーム ${roomId} に参加しました。`
    //     );
    //     cardGameHandler.setupBotMatchSocket(socket, userName);
    //   } else {
    //     console.log(`ルーム:${roomId} は満員。`);
    //     return;
    //   }

    //   if (!rooms.has(roomId)) {
    //     rooms.set(roomId, new Set());
    //   }
    //   rooms.get(roomId)!.add(socket.id);

    //   if (!users.has(socket.id)) {
    //     users.set(socket.id, userName);
    //   }
    // });

    socket.on(ROOM_EVENTS.LEAVE_ROOM, (roomId) => {
      socket.leave(roomId);
      cardGameHandlers.get(roomId)?.cleanupRoom();
      if (rooms.has(roomId)) {
        rooms.get(roomId)?.delete(socket.id);
        if (rooms.get(roomId)!.size === 0) {
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
      // ランダムマッチで待機中に切断されるとその後マッチしない部屋ができてしまうため、roomIdを更新する
      randomRoomIdMaker.renewRoomIdWhenDisconnected(socket.id);
      console.log(
        `ユーザー${users.get(socket.id)}:${socket.id}が切断しました。`
      );
    });
  });
};
