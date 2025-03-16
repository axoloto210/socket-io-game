import { io, Socket } from "socket.io-client";
import { useRoom } from "../hooks/useRoom";
import { CardGame } from "./CardGame";
import { ReturnTopButton } from "./ui/ReturnTopButton";
import { useEffect } from "react";
import { ROOM_EVENTS } from "@socket-io-game/common";

const socket: Socket = io(import.meta.env.VITE_BACKEND_URL);

export const RandomMatchRoom = () => {
  const { currentRoomId, errorMessage, joinRoom } = useRoom(socket);
  const isInRoom = currentRoomId && !errorMessage;

  useEffect(() => {
    socket.on(ROOM_EVENTS.RANDOM_ROOM_ASSIGNED, (roomId: string) => {
      joinRoom(roomId);
    });
    socket.emit(ROOM_EVENTS.JOIN_RANDOM_ROOM)
    return () => {
      socket.off(ROOM_EVENTS.RANDOM_ROOM_ASSIGNED)
    }
  }, []);

  return (
    <>
      <div className="p-4">
        {errorMessage && (
          <>
            <div className="text-red-500">{errorMessage}</div>
            <ReturnTopButton />
          </>
        )}
      </div>
      {isInRoom && <CardGame socket={socket} />}
    </>
  );
};
