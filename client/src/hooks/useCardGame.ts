import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { CARD_GAME_EVENTS } from "../common/src/const/room";
import { CardGameStatus } from "../common/src/types";

export const useCardGame = (socket: Socket) => {

  const [cardGameStatus, setCardGameStatus] = useState<CardGameStatus>({
    status: CARD_GAME_EVENTS.PENDING,
    playerStatuses: {},
  });


    // メッセージ受信のハンドラー
    useEffect(() => {
      socket.on(CARD_GAME_EVENTS.RECEIVE_CARD_GAME, (data) => {
        setCardGameStatus(data);
      });

      return () => {
        socket.off(CARD_GAME_EVENTS.RECEIVE_CARD_GAME);
      };
    }, [socket]);

  return {
    cardGameStatus,
    setCardGameStatus,
  };
};
