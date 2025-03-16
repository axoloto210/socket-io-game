import { useState } from "react";
import Room from "./Room";
import { RandomMatchRoom } from "./RandomMatchRoom";

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
      {/* TODO:地球のアイコンなどを文字の上に入れてワールドワイドに戦う感じを出す。 */}
      <button onClick={()=>setSelectedMode(ROOM_MODE.RANDOM)}>だれかと</button>
      
      <button onClick={()=>setSelectedMode(ROOM_MODE.ROOM_ID)}>部屋であつまる</button>
      </>}
      {selectedMode === ROOM_MODE.RANDOM ? (
        <RandomMatchRoom />
      ) : selectedMode === ROOM_MODE.ROOM_ID ? (
        <Room />
      ) : undefined}
    </>
  );
};
