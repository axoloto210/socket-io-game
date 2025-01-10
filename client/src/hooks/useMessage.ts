
import { useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { UserContext } from "../contexts/UserContext";
import { Message } from "../common/src/types";
import { ROOM_EVENTS } from "../common/src/const/room";


export const useMessage = (socket: Socket) => {
  const user = useContext(UserContext);

  const [message, setMessage] = useState<string>("");

  const [messages, setMessages] = useState<Message[]>([]);

  // メッセージ受信のハンドラー
  useEffect(() => {
    socket.on(ROOM_EVENTS.RECEIVE_MESSAGE, (data) => {
      setMessages(data);
    });

    return () => {
      socket.off(ROOM_EVENTS.RECEIVE_MESSAGE);
    };
  }, [socket]);

  // メッセージ送信処理
  const sendMessage = ({ currentRoomId }: { currentRoomId: string }) => {
    if (message && message.trim() && currentRoomId) {
      socket.emit(ROOM_EVENTS.SEND_MESSAGE, {
        roomId: currentRoomId,
        userName: user.userName,
        message: message.trim(),
      });
      setMessage("");
    }
  };

  return {
    message,
    setMessage,
    messages,
    setMessages,
    sendMessage,
  };
};
