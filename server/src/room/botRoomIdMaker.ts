import { BOT_ROOM_PREFIX } from "@socket-io-game/common";

export class BotRoomIdMaker {
  private roomIdIndex: number;

  constructor() {
    this.roomIdIndex = 0;
  }

  private getRoomId() {
    return `${BOT_ROOM_PREFIX}${this.roomIdIndex}`;
  }

  private renewRoomId() {
    this.roomIdIndex++;
  }

  fetchRoomId() {
    const roomId = this.getRoomId();
    this.renewRoomId();
    return roomId;
  }
}
