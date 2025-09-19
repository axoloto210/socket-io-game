import { useCallback, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { UserContext } from "../contexts/UserContext";
import { ROOM_EVENTS } from "@socket-io-game/common";

export const useRoom = (socket: Socket) => {
  const user = useContext(UserContext);

  const [currentRoomId, setCurrentRoomId] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    socket.on(ROOM_EVENTS.ROOM_FULL, ({ message }) => {
      setErrorMessage(message);
    });

    socket.on(ROOM_EVENTS.ROOM_DISMISS, ({ message }) => {
      setErrorMessage(message);
    });
    return () => {
      socket.off(ROOM_EVENTS.ROOM_FULL);
      socket.off(ROOM_EVENTS.ROOM_DISMISS);
    };
  }, [socket]);

  // ルーム参加処理
  const joinRoom = useCallback(
    ({
      roomId,
      isBotMatch,
      isDeluxeMode,
    }: {
      roomId: string;
      isBotMatch: boolean;
      isDeluxeMode: boolean;
    }) => {
      if (roomId && roomId.trim()) {
        if (currentRoomId) {
          socket.emit(ROOM_EVENTS.LEAVE_ROOM, currentRoomId);
        }

        if (isDeluxeMode) {
          socket.emit(
            isBotMatch
              ? ROOM_EVENTS.JOIN_DELUXE_BOT_ROOM
              : ROOM_EVENTS.JOIN_DELUXE_ROOM,
            { roomId, userName: user.userName },
          );
          setCurrentRoomId(roomId);
        } else {
          socket.emit(
            isBotMatch ? ROOM_EVENTS.JOIN_BOT_ROOM : ROOM_EVENTS.JOIN_ROOM,
            { roomId, userName: user.userName },
          );
          setCurrentRoomId(roomId);
        }
      }
    },
    [currentRoomId, socket, user.userName],
  );

  // ルーム退室処理
  const leaveRoom = () => {
    socket.emit(ROOM_EVENTS.LEAVE_ROOM, currentRoomId);
    setCurrentRoomId("");
  };

  return {
    currentRoomId,
    errorMessage,
    joinRoom,
    leaveRoom,
  };
};
