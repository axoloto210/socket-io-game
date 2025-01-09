import { useState } from "react";
import { io, Socket } from "socket.io-client";
import { useRoom } from "../hooks/useRoom";
import { useMessage } from "../hooks/useMessage";

const socket: Socket = io(import.meta.env.VITE_BACKEND_URL);

const Room = () => {
  const [roomId, setRoomId] = useState<string>("");

  const { currentRoomId, joinRoom } = useRoom(socket);
  const { message, setMessage, messages, sendMessage } = useMessage(socket);

  return (
    <div className="p-4">
      {!currentRoomId && (
        <div className="mb-4">
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="ルームIDを入力"
            className="border p-2 mr-2"
          />
          <button
            onClick={() => joinRoom(roomId)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            ルームに参加
          </button>
        </div>
      )}
      {currentRoomId && (
        <div className="mb-4">
          <p>現在のルーム: {currentRoomId}</p>
        </div>
      )}

      <div className="mb-4 h-96 overflow-y-auto border p-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <span className="font-bold">{msg.userName}:</span>
            <span className="ml-2">{msg.message}</span>
            <span className="text-sm text-gray-500 ml-2">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>

      {currentRoomId && (
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && sendMessage({ currentRoomId })
            }
            placeholder="メッセージを入力"
          />
          <button onClick={() => sendMessage({ currentRoomId })}>送信</button>
        </div>
      )}
    </div>
  );
};

export default Room;
