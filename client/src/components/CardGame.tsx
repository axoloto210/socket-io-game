import { Socket } from "socket.io-client";
import { useCardGame } from "../hooks/useCardGame";
import { CARD_GAME_EVENTS } from "../common/src/const/room";
import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { Card } from "../common/src/types";

type CardGameProps = {
  socket: Socket;
  currentRoomId: string;
};

export const CardGame = (props: CardGameProps) => {
  const user = useContext(UserContext);
  const { socket, currentRoomId } = props;

  const { cardGameStatus, sendReadyForStartStatus } = useCardGame(socket);

  const [isReady, setIsReady] = useState(false);

  const userStatus = cardGameStatus.roomUsersStatus[user.userName];

  return (
    <>
        {cardGameStatus.status === CARD_GAME_EVENTS.PENDING && !isReady && (
          <button
            onClick={() => {
              sendReadyForStartStatus({ currentRoomId });
              setIsReady(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            準備OK
          </button>
        )}
        {userStatus &&
          userStatus.hands.map((hand) => {
            return <CardComponent {...hand} />;
          })}
    </>
  );
};

const CardComponent = (props: Card) => {
  const { power } = props;
  return (
    <div className="w-32 h-48 bg-white rounded-lg shadow-lg border-2 border-gray-200 flex items-center justify-center relative cursor-pointer hover:shadow-xl transition-all duration-300 hover:opacity-70">
      {/* Center number */}
      <span className="text-5xl font-bold text-gray-900">{power}</span>

      {/* Top left number */}
      <span className="absolute top-2 left-2 text-xl font-semibold text-gray-900">
        {power}
      </span>

      {/* Bottom right number (rotated) */}
      <span className="absolute bottom-2 right-2 text-xl font-semibold rotate-180 text-gray-900">
        {power}
      </span>
    </div>
  );
};
