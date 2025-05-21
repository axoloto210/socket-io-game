import { useState } from "react";
import Room from "./Room";
import { RandomMatchRoom } from "./RandomMatchRoom";
import { RoomModeButton } from "./ui/RoomModeButton";
import { BotRoom } from "./BotRoom";
import { assertUnreachable } from "../utils/assertUnreachable";
import { ReturnTopButton } from "./ui/ReturnTopButton";

type RoomMode = (typeof ROOM_MODE)[keyof typeof ROOM_MODE];

const ROOM_MODE = {
  RANDOM: "random",
  ROOM_ID: "room_id",
  BOT: "bot",
} as const;

const getRoomComponent = (roomMode: RoomMode) => {
  switch (roomMode) {
    case ROOM_MODE.RANDOM: {
      return <RandomMatchRoom />;
    }
    case ROOM_MODE.ROOM_ID: {
      return <Room />;
    }
    case ROOM_MODE.BOT: {
      return <BotRoom />;
    }
    default:
      assertUnreachable(roomMode);
  }
};

export const RoomModeSelector = () => {
  const [selectedMode, setSelectedMode] = useState<RoomMode | undefined>();

  return (
    <>
      {!selectedMode && (
        <>
          <div className="flex flex-col justify-center">
            <div className="m-4 flex justify-center">
              <RoomModeButton
                icon={"earth"}
                onClick={() => setSelectedMode(ROOM_MODE.RANDOM)}
              >
                だれかと
              </RoomModeButton>
            </div>
            <div className="m-4 flex justify-center">
              <RoomModeButton
                icon={"persons"}
                onClick={() => setSelectedMode(ROOM_MODE.ROOM_ID)}
              >
                部屋であつまる
              </RoomModeButton>
            </div>
            <div className="m-4 flex justify-center">
              <RoomModeButton
                icon={"bot"}
                onClick={() => setSelectedMode(ROOM_MODE.BOT)}
              >
                CPU戦
              </RoomModeButton>
            </div>
          </div>
          <ReturnTopButton />
        </>
      )}
      {selectedMode && getRoomComponent(selectedMode)}
    </>
  );
};
