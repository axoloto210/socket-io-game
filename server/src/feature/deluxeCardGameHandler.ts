import { Socket } from "socket.io";
import { CARD_GAME_EVENTS, DecidedCardAndItem, Item } from "@socket-io-game/common";
import { Card } from "@socket-io-game/common";
import {
  BaseCardGameHandler,
  CardGameHandlerConfig,
} from "./baseCardGameHandler";
import { BASIC_INITIAL_CARDS } from "../gameConstants";

export class DeluxeCardGameHandler extends BaseCardGameHandler {
  protected readonly maxPlayers: number = 2;
  protected readonly initialCards: Card[] = BASIC_INITIAL_CARDS;

  constructor(config: CardGameHandlerConfig) {
    super(config);
  }

  getInitialItems(): Item[] {
      return this.items.getInitialDxItems();
  }

  setupSocket(socket: Socket, userName: string): boolean {
    this.playerMap.set(socket.id, userName);

    socket.on(
      CARD_GAME_EVENTS.DECIDE_CARD_AND_ITEM,
      (decidedCardAndItem: DecidedCardAndItem) => {
        this.handleCardSelect({
          socketId: socket.id,
          decidedCardAndItem: decidedCardAndItem,
          isBot: false,
        });
      }
    );

    // 2人揃ったらゲーム開始
    if (this.playerMap.size === this.maxPlayers) {
      this.startGame();
    }

    return true;
  }
}
