import { useState } from "react";
import Room from "./Room";
import { RandomMatchRoom } from "./RandomMatchRoom";
import { RoomModeButton } from "./ui/RoomModeButton";
import { BotRoom } from "./BotRoom";
import { assertUnreachable } from "../utils/assertUnreachable";
import { ReturnTopButton } from "./ui/ReturnTopButton";
import { DeluxeRandomRoom } from "./DeluxeRandomRoom";

type RoomMode = (typeof ROOM_MODE)[keyof typeof ROOM_MODE];

const ROOM_MODE = {
  RANDOM: "random",
  ROOM_ID: "room_id",
  BOT: "bot",
  DELUXE_RANDOM: "deluxe_random",
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
    case ROOM_MODE.DELUXE_RANDOM: {
      return <DeluxeRandomRoom />;
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
            <p>基本モード</p>
            <div className="m-4 flex justify-center">
              <RoomModeButton
                color="#99d9ea"
                icon={"earth"}
                onClick={() => setSelectedMode(ROOM_MODE.RANDOM)}
              >
                だれかと
              </RoomModeButton>
            </div>
            <div className="m-4 flex justify-center">
              <RoomModeButton
                color="#99d9ea"
                icon={"persons"}
                onClick={() => setSelectedMode(ROOM_MODE.ROOM_ID)}
              >
                部屋であつまる
              </RoomModeButton>
            </div>
            <div className="m-4 flex justify-center">
              <RoomModeButton
                color="#99d9ea"
                icon={"bot"}
                onClick={() => setSelectedMode(ROOM_MODE.BOT)}
              >
                CPU戦
              </RoomModeButton>
            </div>
            <p>DXモード</p>
            <div className="m-4 flex justify-center">
              <RoomModeButton
                color="#ff0000"
                icon={"earth"}
                onClick={() => setSelectedMode(ROOM_MODE.DELUXE_RANDOM)}
              >
                だれかと
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
