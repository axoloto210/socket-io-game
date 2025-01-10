import { CARD_GAME_EVENTS } from "./const/room";

export type Message = {
  roomId: string;
  userName: string;
  message: string;
  sender: string;
  timestamp: Date;
};

export type Card = {
  cardId: number;
  power: number;
};

export type UserStatus = {
  hp: number;
  hands: Card[];
};

export type CardGameStatus = {
  roomUsersStatus: { [userName: string]: UserStatus };
  status: (typeof CARD_GAME_EVENTS)[keyof typeof CARD_GAME_EVENTS];
};
