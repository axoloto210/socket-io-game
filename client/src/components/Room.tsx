import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

export interface Message {
    message: string;
    sender: string;
    timestamp: Date;
  }
  
  export interface RoomUserCount {
    roomId: string;
    count: number;
  }

const socket = io(import.meta.env.VITE_BACKEND_URL);

const Room = () => {
  const [roomId, setRoomId] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [userCount, setUserCount] = useState<RoomUserCount>();

  // メッセージ受信のハンドラー
  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on('room_users', (data) => {
      setUserCount(data.count);
    });

    return () => {
      socket.off('receive_message');
      socket.off('room_users');
    };
  }, []);

  // ルーム参加処理
  const joinRoom = useCallback(() => {
    if (roomId && roomId.trim()) {
      if (currentRoom) {
        socket.emit('leave_room', currentRoom);
      }
      socket.emit('join_room', roomId);
      setCurrentRoom(roomId);
      setMessages([]);
    }
  }, [roomId, currentRoom]);

  // メッセージ送信処理
  const sendMessage = useCallback(() => {
    if (message && message.trim() && currentRoom) {
      socket.emit('send_message', {
        roomId: currentRoom,
        message: message.trim()
      });
      setMessage('');
    }
  }, [message, currentRoom]);

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="ルームIDを入力"
          className="border p-2 mr-2"
        />
        <button
          onClick={joinRoom}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          ルームに参加
        </button>
      </div>

      {currentRoom && (
        <div className="mb-4">
          <p>現在のルーム: {currentRoom}</p>
          <p>参加者数: {userCount?.count}</p>
        </div>
      )}

      <div className="mb-4 h-96 overflow-y-auto border p-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <span className="font-bold">{msg.sender === socket.id ? 'あなた' : '他のユーザー'}:</span>
            <span className="ml-2">{msg.message}</span>
            <span className="text-sm text-gray-500 ml-2">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>

      {currentRoom && (
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="メッセージを入力"
          />
          <button
            onClick={sendMessage}
          >
            送信
          </button>
        </div>
      )}
    </div>
  );
};

export default Room;