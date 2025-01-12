import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { CARD_GAME_EVENTS } from "../common/src/const/room";
import { CardGameStatus } from "../common/src/types";

export const DEFAULT_CARD_ID = -1;

export const GAME_RESULTS = {
  IN_GAME: "in_game",
  WIN: "win",
  LOSE: "lose",
};

export const useCardGame = (socket: Socket) => {
  const [cardGameStatus, setCardGameStatus] = useState<CardGameStatus>({
    status: CARD_GAME_EVENTS.PENDING,
    playerStatuses: {},
  });

  const [selectedCardId, setSelectedCardId] = useState<number>(DEFAULT_CARD_ID);

  const [selectedItemId, setSelectedItemId] = useState<number | undefined>();

  const isGameEnd = cardGameStatus.status === CARD_GAME_EVENTS.GAME_END;

  const getGameResult = (opponentHp?: number) => {
    if (opponentHp == null) {
      return GAME_RESULTS.IN_GAME;
    }

    if (isGameEnd && opponentHp <= 0) {
      return GAME_RESULTS.WIN;
    } else if (isGameEnd && opponentHp > 0) {
      return GAME_RESULTS.LOSE;
    }

    return GAME_RESULTS.IN_GAME;
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
    getGameResult,
  };
};
