import { DELUXE_RANDOM_ROOM_PREFIX } from "@socket-io-game/common";

export class DeluxeRandomRoomIdMaker {
  private roomIdIndex;
  private inRoomUserSet: Set<string>;

  constructor() {
    this.roomIdIndex = 0;
    this.inRoomUserSet = new Set();
  }

  private getRoomId() {
    return `${DELUXE_RANDOM_ROOM_PREFIX}${Math.floor(this.roomIdIndex / 2)}`;
  }

  private renewRoomId() {
    this.roomIdIndex++;
  }

  joinRoom(socketId: string) {
    this.inRoomUserSet.add(socketId);
  }

  fetchRoomId() {
    const roomId = this.getRoomId();
    this.renewRoomId();
    return roomId;
  }

  renewRoomIdWhenDisconnected(socketId: string) {
    if (this.inRoomUserSet.has(socketId)) {
      if (this.roomIdIndex % 2 === 0) {
        return;
      } else {
        this.renewRoomId();
      }
    }
  }
}
