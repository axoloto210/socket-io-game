import { useState } from "react";
import Room from "./Room";
import { RandomMatchRoom } from "./RandomMatchRoom";
import { RoomModeButton } from "./ui/RoomModeButton";
import { BotRoom } from "./BotRoom";
import { assertUnreachable } from "../utils/assertUnreachable";
import { ReturnTopButton } from "./ui/ReturnTopButton";
import { DeluxeRandomRoom } from "./DeluxeRandomRoom";
import { DeluxeBotRoom } from "./DeluxeBotRoom";

type RoomMode = (typeof ROOM_MODE)[keyof typeof ROOM_MODE];

const ROOM_MODE = {
  RANDOM: "random",
  ROOM_ID: "room_id",
  BOT: "bot",
  DELUXE_RANDOM: "deluxe_random",
  DELUXE_BOT: "deluxe_bot",
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
    case ROOM_MODE.DELUXE_BOT: {
      return <DeluxeBotRoom/>
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
            <div className="mt-4 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 text-center border-b-2 border-blue-300 pb-2">
                基本モード
              </h2>
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
                  あつまる
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
            </div>
            <div className="mt-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4 text-center border-b-2 border-red-300 pb-2">
                DXモード
              </h2>
              <div className="m-4 flex justify-center">
                <RoomModeButton
                  color="#ff0000"
                  icon={"earth"}
                  onClick={() => setSelectedMode(ROOM_MODE.DELUXE_RANDOM)}
                >
                  だれかと
                </RoomModeButton>
              </div>
              <div className="m-4 flex justify-center">
                <RoomModeButton
                  color="#ff0000"
                  icon={"bot"}
                  onClick={() => setSelectedMode(ROOM_MODE.DELUXE_BOT)}
                >
                  CPU戦
                </RoomModeButton>
              </div>
            </div>
          </div>
          <ReturnTopButton />
        </>
      )}
      {selectedMode && getRoomComponent(selectedMode)}
    </>
  );
};
