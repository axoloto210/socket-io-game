import { useRoom } from "../hooks/useRoom";
import { CardGame } from "./CardGame";
import { ReturnTopButton } from "./ui/ReturnTopButton";
import { useEffect } from "react";
import { ROOM_EVENTS } from "@socket-io-game/common";
import { socket } from "../socket";

export const RandomMatchRoom = () => {
  const { currentRoomId, errorMessage, joinRoom } = useRoom(socket);
  const isInRoom = currentRoomId && !errorMessage;

  useEffect(() => {
    socket.on(ROOM_EVENTS.RANDOM_ROOM_ASSIGNED, (roomId: string) => {
      joinRoom({ roomId, isBotMatch: false, isDeluxeMode: false });
    });
    socket.emit(ROOM_EVENTS.ASSIGN_RANDOM_ROOM_ID);
    return () => {
      socket.off(ROOM_EVENTS.RANDOM_ROOM_ASSIGNED);
    };
  }, []);

  return (
    <>
      {errorMessage && (
        <div className="p-4">
          <div className="text-red-500">{errorMessage}</div>
          <ReturnTopButton />
        </div>
      )}

      {isInRoom && <CardGame socket={socket} />}
    </>
  );
};
