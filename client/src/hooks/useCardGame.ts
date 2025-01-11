
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { CARD_GAME_EVENTS } from "../common/src/const/room";
import { CardGameStatus } from "../common/src/types";

 export const DEFAULT_CARD_ID = -1;

export const useCardGame = (socket: Socket) => {
  const [cardGameStatus, setCardGameStatus] = useState<CardGameStatus>({
    status: CARD_GAME_EVENTS.PENDING,
    playerStatuses: {},
  });

  const [selectedCardId, setSelectedCardId] = useState<number>(DEFAULT_CARD_ID);

  const [selectedItemId, setSelectedItemId] = useState<number | undefined>();

  // メッセージ受信のハンドラー
  useEffect(() => {
    socket.on(CARD_GAME_EVENTS.RECEIVE_CARD_GAME, (data) => {
      setCardGameStatus(data);
    });

    return () => {
      socket.off(CARD_GAME_EVENTS.RECEIVE_CARD_GAME);
    };
  }, [socket]);

  const selectCard = (cardId: number, itemId?: number) => {
    if (cardId === DEFAULT_CARD_ID) {
      return;
    }
    socket.emit(CARD_GAME_EVENTS.SELECT_CARD, { cardId, itemId });
  };

  return {
    cardGameStatus,
    setCardGameStatus,
    selectCard,
    selectedCardId,
    setSelectedCardId,
    selectedItemId,
    setSelectedItemId,
  };
};
