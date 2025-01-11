import { Socket } from "socket.io-client";
import { useCardGame } from "../hooks/useCardGame";
import { Card } from "../common/src/types";

type CardGameProps = {
  socket: Socket;
  currentRoomId: string;
};

export const CardGame = (props: CardGameProps) => {
  const { socket } = props;

  const { cardGameStatus } = useCardGame(socket);

  console.log(cardGameStatus);

  const playerStatus = cardGameStatus.playerStatuses[socket.id!];

  const opponentStatusKey = Object.keys(cardGameStatus.playerStatuses).filter(
    (key) => key !== socket.id!
  )[0];

  const opponentStatus = cardGameStatus.playerStatuses[opponentStatusKey];

  return (
    <>
      {playerStatus && (
        <>
          <div> {opponentStatus.userName}</div>
          <div className="flex">
            {opponentStatus.hands.map(() => {
              return <CardComponent isOpponent={true} />;
            })}
          </div>
          <div>VS</div>
          <div>{playerStatus.userName}</div>
          <div className="flex">
            {playerStatus.hands.map((hand) => {
              return <CardComponent {...hand} />;
            })}
          </div>
        </>
      )}
    </>
  );
};

type CardComponentProps = Partial<Card> & { isOpponent?: boolean };

const CardComponent = (props: CardComponentProps) => {
  const { power, isOpponent } = props;
  const cardText = isOpponent ? "?" : power;

  return (
    <button 
      disabled={isOpponent}
      className={`
        w-32 h-48 
        bg-white rounded-lg 
        shadow-lg border-2 border-gray-200 
        flex items-center justify-center 
        relative 
        transition-all duration-300 
        ${isOpponent 
          ? '' 
          : 'cursor-pointer hover:shadow-xl hover:opacity-70'
        }
      `}
    >
      {/* Center number */}
      <span className="text-5xl font-bold text-gray-900">{cardText}</span>
      
      {/* Top left number */}
      <span className="absolute top-2 left-2 text-xl font-semibold text-gray-900">
        {cardText}
      </span>
      
      {/* Bottom right number (rotated) */}
      <span className="absolute bottom-2 right-2 text-xl font-semibold rotate-180 text-gray-900">
        {cardText}
      </span>
    </button>
  );
};