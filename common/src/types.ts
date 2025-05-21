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

export type Item = {
  itemId: number,
  itemName: string,
  itemEffect: string,
  itemImageUrl: string,
}

export type PlayerStatus = {
  userName: string;
  hp: number;
  hands: Card[];
  items: Item[];
};

export type PlayerStatuses = { [socketId: string]: PlayerStatus };

export type SelectedCards = Record<string, {
  playerName?: string;
  card?: Card;
  item?: Item;
}>

export type CardGameStatus = {
  playerStatuses: PlayerStatuses;
  status: (typeof CARD_GAME_EVENTS)[keyof typeof CARD_GAME_EVENTS];
  selectedCards?: SelectedCards
};
