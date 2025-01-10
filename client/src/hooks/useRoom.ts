import { ROOM_EVENTS } from "@socket-io-game/common/src/const/room";
import { useContext, useState } from "react";
import { Socket } from "socket.io-client";
import { UserContext } from "../contexts/UserContext";

export const useRoom = (socket: Socket) => {
  const user = useContext(UserContext);

  const [currentRoomId, setCurrentRoomId] = useState<string>("");

  // ルーム参加処理
  const joinRoom = (roomId: string) => {
    if (roomId && roomId.trim()) {
      if (currentRoomId) {
        socket.emit(ROOM_EVENTS.LEAVE_ROOM, currentRoomId);
      }
      socket.emit(ROOM_EVENTS.JOIN_ROOM, { roomId, userName: user.userName });
      setCurrentRoomId(roomId);
    }
  };

  // ルーム退室処理
  const leaveRoom = () => {
    socket.emit(ROOM_EVENTS.LEAVE_ROOM, currentRoomId);
    setCurrentRoomId("");
  };

  return {
    currentRoomId,
    joinRoom,
    leaveRoom,
  };
};
