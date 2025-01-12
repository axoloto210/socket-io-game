import { useState } from "react";
import { io, Socket } from "socket.io-client";
import { useRoom } from "../hooks/useRoom";
import { CardGame } from "./CardGame";


const socket: Socket = io(import.meta.env.VITE_BACKEND_URL);

const Room = () => {
  const [roomId, setRoomId] = useState<string>("");

  const { currentRoomId, errorMessage, joinRoom, leaveRoom } = useRoom(socket);

  const clickJoinHandler = () => {
    joinRoom(roomId);
  };

  const isInRoom = currentRoomId && !errorMessage
  return (
    <>
      <div className="p-4">
        {!currentRoomId && (
          <div className="mb-4">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="ルームIDを入力"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  clickJoinHandler();
                }
              }}
              className="border p-2 mr-2"
            />
            <button
              onClick={clickJoinHandler}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              ルームに参加
            </button>
          </div>
        )}
        {errorMessage && (
          <div className="text-red-500">{errorMessage}</div>
        )}
        {isInRoom && (
          <div className="mb-4 flex">
            <p className="mr-4">現在のルーム: {currentRoomId}</p>
            <button
              onClick={leaveRoom}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              ルームから出る
            </button>
          </div>
        )}
      </div>
      {isInRoom && (
        <CardGame socket={socket} currentRoomId={currentRoomId}/>
      )}
    </>
  );
};

export default Room;
