import { Socket } from "socket.io";
import { CARD_GAME_EVENTS } from "@socket-io-game/common";
import { Card } from "@socket-io-game/common";
import {
  BaseCardGameHandler,
  CardGameHandlerConfig,
} from "./baseCardGameHandler";
import { BASIC_INITIAL_CARDS } from "../gameConstants";

const BOT_NAME = "BOT🤖";

export class BotCardGameHandler extends BaseCardGameHandler {
  protected botId: string = "";
  protected readonly maxPlayers: number = 1;
  protected initialCards: Card[] = BASIC_INITIAL_CARDS;

  constructor(config: CardGameHandlerConfig) {
    super(config);
    this.botId = "botId-" + this.roomId;
  }

  setupSocket(socket: Socket, userName: string): boolean {
    this.playerMap.set(socket.id, userName);
    this.playerMap.set(this.botId!, BOT_NAME);

    socket.on(CARD_GAME_EVENTS.DECIDE_CARD_AND_ITEM, (data) => {
      this.handleCardSelect({
        socketId: socket.id,
        decidedCardAndItem: data,
        isBot: false,
      });
    });

    this.startGame();

    return true;
  }

  protected isAllPlayerSelected(): boolean {
    return this.selectedCards.size === this.maxPlayers + 1;
  }

  protected onGameStart(): void {
    this.scheduleBotMove();
  }

  protected onRoundEnd(): void {
    this.scheduleBotMove();
  }

  /**
   * Botにカード選択を行わせる
   */
  private scheduleBotMove() {
    if (this.botId && this.gameStarted) {
      const botStatus = this.cardGameStatus.playerStatuses[this.botId];
      if (botStatus && botStatus.hands.length > 0) {
        // ランダムに手札から1枚選択
        const randomCardIndex = Math.floor(
          Math.random() * botStatus.hands.length
        );
        const randomCard = botStatus.hands[randomCardIndex];

        let itemId = undefined;
        if (botStatus.items.length > 0) {
          const randomItemIndex = Math.floor(
            Math.random() * botStatus.items.length
          );
          itemId = botStatus.items[randomItemIndex].itemId;
        }

        this.handleCardSelect({
          socketId: this.botId,
          decidedCardAndItem: {
            card: randomCard,
            itemId,
          },
          isBot: true,
        });
      }
    }
  }
}
