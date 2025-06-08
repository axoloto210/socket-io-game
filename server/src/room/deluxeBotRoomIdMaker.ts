import { DELUXE_BOT_ROOM_PREFIX } from "@socket-io-game/common";

export class DeluxeBotRoomIdMaker {
  private roomIdIndex: number;

  constructor() {
    this.roomIdIndex = 0;
  }

  private getRoomId() {
    return `${DELUXE_BOT_ROOM_PREFIX}${this.roomIdIndex}`;
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
