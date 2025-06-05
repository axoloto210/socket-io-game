import { useRoom } from "../hooks/useRoom";
import { CardGame } from "./CardGame";
import { ReturnTopButton } from "./ui/ReturnTopButton";
import { useEffect } from "react";
import { ROOM_EVENTS } from "@socket-io-game/common";
import { socket } from "../socket";

export const BotRoom = () => {
  const { currentRoomId, errorMessage, joinRoom } = useRoom(socket);
  const isInRoom = currentRoomId && !errorMessage;

  useEffect(() => {
    socket.on(ROOM_EVENTS.BOT_ROOM_ASSIGNED, (roomId: string) => {
      joinRoom({ roomId, isBotMatch: true, isDeluxeMode: false });
    });
    socket.emit(ROOM_EVENTS.ASSIGN_BOT_ROOM_ID);
    return () => {
      socket.off(ROOM_EVENTS.BOT_ROOM_ASSIGNED);
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
