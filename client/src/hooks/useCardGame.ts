import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { Card, CARD_GAME_EVENTS } from "@socket-io-game/common";
import { CardGameStatus } from "@socket-io-game/common";

export const DEFAULT_CARD = {
  cardId: -1,
  power: -9999,
};

export const GAME_RESULTS = {
  IN_GAME: "in_game",
  WIN: "win",
  LOSE: "lose",
  DRAW: "draw",
};

export type GameResult = (typeof GAME_RESULTS)[keyof typeof GAME_RESULTS]

export const useCardGame = (socket: Socket) => {
  const [cardGameStatus, setCardGameStatus] = useState<CardGameStatus>({
    status: CARD_GAME_EVENTS.PENDING,
    playerStatuses: {},
  });

  const [selectedCard, setSelectedCard] = useState<Card>(DEFAULT_CARD);

  const [selectedItemId, setSelectedItemId] = useState<number | undefined>();

  const [isCardDecided, setIsCardDecided] = useState(false);

  const isGameEnd = cardGameStatus.status === CARD_GAME_EVENTS.GAME_END;

  const getGameResult = (
    playerHp?: number,
    opponentHp?: number
  ): GameResult => {
    if (opponentHp == null) {
      return GAME_RESULTS.IN_GAME;
    } else if (playerHp == null) {
      return GAME_RESULTS.IN_GAME;
    }

    if (isGameEnd && opponentHp <= 0 && playerHp > 0) {
      return GAME_RESULTS.WIN;
    } else if (isGameEnd && opponentHp > 0 && playerHp <= 0) {
      return GAME_RESULTS.LOSE;
    } else if (isGameEnd && opponentHp <= 0 && playerHp <= 0) {
      return GAME_RESULTS.DRAW;
    }

    return GAME_RESULTS.IN_GAME;
  };

  // メッセージ受信のハンドラー
  useEffect(() => {
    socket.on(CARD_GAME_EVENTS.RECEIVE_CARD_GAME, (data) => {
      setCardGameStatus(data);
      setIsCardDecided(false);
      setSelectedCard(DEFAULT_CARD);
      setSelectedItemId(undefined);
    });

    return () => {
      socket.off(CARD_GAME_EVENTS.RECEIVE_CARD_GAME);
    };
  }, [socket]);

  const decidedCardAndItem = (card: Card, itemId?: number) => {
    if (card.cardId === DEFAULT_CARD.cardId) {
      return;
    }
    socket.emit(CARD_GAME_EVENTS.DECIDE_CARD_AND_ITEM, { card, itemId });
  };

  return {
    cardGameStatus,
    setCardGameStatus,
    decidedCardAndItem,
    selectedCard,
    setSelectedCard,
    selectedItemId,
    setSelectedItemId,
    isCardDecided,
    setIsCardDecided,
    getGameResult,
  };
};
