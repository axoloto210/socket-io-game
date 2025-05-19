import { RANDOM_ROOM_PREFIX } from "@socket-io-game/common";

export class RandomRoomIdMaker {
  private roomIdIndex;

  constructor() {
    this.roomIdIndex = 0;
  }

  private getRoomId() {
    return `${RANDOM_ROOM_PREFIX}${Math.floor(this.roomIdIndex / 2)}`;
  }

  private renewRoomId() {
    this.roomIdIndex++;
  }

  fetchRoomId() {
    const roomId = this.getRoomId();
    this.renewRoomId();
    return roomId;
  }

  renewRoomIdWhenDisconnected() {
    if (this.roomIdIndex % 2 === 0) {
      return;
    } else {
      this.renewRoomId()
    }
  }
}
