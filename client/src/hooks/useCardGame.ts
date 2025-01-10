import { useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { UserContext } from "../contexts/UserContext";
import { CARD_GAME_EVENTS } from "../common/src/const/room";
import { CardGameStatus } from "../common/src/types";

export const useCardGame = (socket: Socket) => {
  const user = useContext(UserContext);

  const [cardGameStatus, setCardGameStatus] = useState<CardGameStatus>({
    status: CARD_GAME_EVENTS.PENDING,
    roomUsersStatus: {},
  });

  const sendReadyForStartStatus = ({
    currentRoomId,
  }: {
    currentRoomId: string;
  }) => {
    socket.emit(CARD_GAME_EVENTS.PENDING, {
      roomId: currentRoomId,
      userName: user.userName,
    });
  };

    // メッセージ受信のハンドラー
    useEffect(() => {
      socket.on(CARD_GAME_EVENTS.RECEIVE_CARD_GAME, (data) => {
        setCardGameStatus(data);
      });

      return () => {
        socket.off(CARD_GAME_EVENTS.RECEIVE_CARD_GAME);
      };
    }, [socket]);

  //   // メッセージ送信処理
  //   const sendMessage = ({ currentRoomId }: { currentRoomId: string }) => {
  //     if (message && message.trim() && currentRoomId) {
  //       socket.emit(MESSAGE_EVENTS.SEND_MESSAGE, {
  //         roomId: currentRoomId,
  //         userName: user.userName,
  //         message: message.trim(),
  //       });
  //       setMessage("");
  //     }
  //   };

  return {
    cardGameStatus,
    setCardGameStatus,
    sendReadyForStartStatus,
  };
};
