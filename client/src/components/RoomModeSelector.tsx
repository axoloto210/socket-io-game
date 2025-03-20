import { useState } from "react";
import Room from "./Room";
import { RandomMatchRoom } from "./RandomMatchRoom";
import { RoomModeButton } from "./ui/RoomModeButton";

type RoomMode = typeof ROOM_MODE[keyof typeof ROOM_MODE]

const ROOM_MODE = {
  RANDOM: "random",
  ROOM_ID: "room_id",
} as const;

export const RoomModeSelector = () => {
  const [selectedMode, setSelectedMode] = useState<RoomMode | undefined>();

  return (
    <>
      {!selectedMode && 
      <>
      <div className="flex flex-col justify-center">
        <div className="m-4 flex justify-center">
      <RoomModeButton icon={'earth'} onClick={()=>setSelectedMode(ROOM_MODE.RANDOM)}>
      だれかと
      </RoomModeButton>
      </div>
      <div className="m-4 flex justify-center">
      <RoomModeButton icon={'persons'} onClick={()=>setSelectedMode(ROOM_MODE.ROOM_ID)}>
      部屋であつまる
      </RoomModeButton>
      </div>
      </div>
      </>}
      {selectedMode === ROOM_MODE.RANDOM ? (
        <RandomMatchRoom />
      ) : selectedMode === ROOM_MODE.ROOM_ID ? (
        <Room />
      ) : undefined}
    </>
  );
};
