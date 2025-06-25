import { Socket } from "socket.io-client";
import { DEFAULT_CARD, GAME_RESULTS, useCardGame } from "../hooks/useCardGame";
import {
  Card,
  Item,
  calculatePowerDiff,
  isRestrictedPair,
} from "@socket-io-game/common";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { LoadingOverlay } from "./ui/LoadingOverlay";
import { CardGameTable } from "./CardGameTable";
import { PlayerNamePlate } from "./ui/PlayerNamePlate";
import { WaitingOpponent } from "./ui/WaitingOpponent";
import { Hearts } from "./ui/Hearts";
import { GameEnd } from "./ui/GameEnd";

type CardGameProps = {
  socket: Socket;
};

export const CardGame = (props: CardGameProps) => {
  const { socket } = props;
  if (socket.id == null) {
    return null;
  }

  const {
    cardGameStatus,
    decidedCardAndItem,
    selectedCard,
    setSelectedCard,
    selectedItemId,
    setSelectedItemId,
    isCardDecided,
    setIsCardDecided,
    getGameResult,
  } = useCardGame(socket);

  const playerStatus = cardGameStatus.playerStatuses[socket.id];

  const playerSelectedCards = cardGameStatus.selectedCards
    ? cardGameStatus.selectedCards[socket.id]
    : undefined;

  const opponentStatusKey = Object.keys(cardGameStatus.playerStatuses).filter(
    (key) => key !== socket.id
  )[0];

  const opponentStatus = cardGameStatus.playerStatuses[opponentStatusKey];

  const opponentSelectedCards = cardGameStatus.selectedCards
    ? cardGameStatus.selectedCards[opponentStatusKey]
    : undefined;

  const gameResult = getGameResult(playerStatus?.hp, opponentStatus?.hp);

  const handleDecideClick = () => {
    // カードの選択は必須
    if (selectedCard.cardId === DEFAULT_CARD.cardId) {
      return;
    }
    setIsCardDecided(true);
    setTimeout(() => {
      decidedCardAndItem(selectedCard, selectedItemId);
    }, 500);
  };

  const handleItemClick = (itemId: number) => {
    if (itemId === selectedItemId) {
      setSelectedItemId(undefined);
    } else {
      setSelectedItemId(itemId);
    }
  };

  return (
    <>
      {playerStatus ? (
        <>
          <CardGameTable>
            {gameResult !== GAME_RESULTS.IN_GAME && (
              <GameEnd gameResult={gameResult} />
            )}

            <div className="flex items-center justify-center ml-2 mr-2 mb-2">
              {[...Array(opponentStatus.hands.length)].map(() => {
                return <OpponentCardComponent />;
              })}
            </div>
            <div className="flex flex-col items-center justify-center mb-2">
              <div className="flex justify-center mt-4 min-w-full relative">
                <PlayerNamePlate playerName={opponentStatus.userName}>
                  <Hearts hp={opponentStatus.hp} />
                </PlayerNamePlate>
                <div className="flex justify-center mx-auto pl-12">
                  {opponentSelectedCards?.card ? (
                    <div className="relative">
                      <RevealedCardComponent
                        power={opponentSelectedCards.card.power}
                      />
                      <AnimatedPowerChange
                        playerSelectedCardPower={
                          opponentSelectedCards.card.power
                        }
                        playerSelectedItemId={
                          opponentSelectedCards.item?.itemId
                        }
                        opponentSelectedItemId={
                          playerSelectedCards?.item?.itemId
                        }
                      />
                    </div>
                  ) : (
                    <CardComponentArea />
                  )}
                  <div>
                    {opponentSelectedCards?.item ? (
                      <RevealedItemComponent
                        itemName={opponentSelectedCards.item.itemName}
                        itemImageUrl={opponentSelectedCards.item.itemImageUrl}
                      />
                    ) : (
                      <ItemComponentArea />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex min-w-full mt-2 relative">
                <PlayerNamePlate playerName={playerStatus.userName}>
                  <Hearts hp={playerStatus.hp} />
                </PlayerNamePlate>
                <div className="flex justify-center mx-auto pl-12">
                  {playerSelectedCards?.card ? (
                    <div className="relative">
                      <RevealedCardComponent
                        power={playerSelectedCards.card.power}
                      />
                      <AnimatedPowerChange
                        playerSelectedCardPower={playerSelectedCards.card.power}
                        playerSelectedItemId={playerSelectedCards.item?.itemId}
                        opponentSelectedItemId={
                          opponentSelectedCards?.item?.itemId
                        }
                      />
                    </div>
                  ) : (
                    <CardComponentArea />
                  )}
                  <div>
                    {playerSelectedCards?.item ? (
                      <RevealedItemComponent
                        itemName={playerSelectedCards.item.itemName}
                        itemImageUrl={playerSelectedCards.item.itemImageUrl}
                      />
                    ) : (
                      <ItemComponentArea />
                    )}
                  </div>
                </div>
                <button
                  className="absolute right-2 max-md:right-[-12px] top-1/2 -translate-y-1/2 bg-blue-500 text-white h-12 w-16 max-md:text-[16px] px-4 max-md:px-2 py-2 max-md:py-1 rounded ml-auto mt-16 mb-16 max-md:mt-4 max-md:mb-4"
                  onClick={handleDecideClick}
                >
                  SET
                </button>
              </div>
            </div>
            <LoadingOverlay isLoading={isCardDecided}>
              <div className="flex items-center justify-center ml-2 mr-2 mb-2">
                {playerStatus.hands.map((hand) => {
                  return (
                    <CardComponent
                      card={hand}
                      currentCardId={selectedCard.cardId}
                      currentItemId={selectedItemId}
                      onClick={setSelectedCard}
                    />
                  );
                })}
              </div>
              <div className="flex ml-2 mr-2 mt-2">
                {playerStatus.items.map((item) => {
                  return (
                    <ItemComponent
                      {...item}
                      power={selectedCard.power}
                      currentCardId={selectedCard.cardId}
                      currentItemId={selectedItemId}
                      onClick={handleItemClick}
                    />
                  );
                })}
              </div>
            </LoadingOverlay>
          </CardGameTable>
        </>
      ) : (
        <WaitingOpponent />
      )}
    </>
  );
};

const CardComponent = (props: {
  card: Card;
  currentCardId: number;
  currentItemId?: number;
  onClick: Dispatch<SetStateAction<Card>>;
}) => {
  const { cardId, power } = props.card;
  const cardText = power;

  const isRestricted = isRestrictedPair({ power, itemId: props.currentItemId });

  return (
    <button
      onClick={() => props.onClick(props.card)}
      disabled={isRestricted}
      className={`
        w-32 h-48
        max-md:w-16 max-md:h-24 
        rounded-lg 
        shadow-lg border-2 border-gray-200 
        flex items-center justify-center 
        relative 
        transition-all duration-300 
        cursor-pointer hover:shadow-xl hover:bg-sky-500
        ${cardId === props.currentCardId ? "bg-sky-300" : " bg-white"}
      `}
    >
      <span className="text-5xl max-md:text-3xl font-bold text-gray-900">
        {cardText}
      </span>

      <span className="absolute top-1 left-1 text-xl max-md:text-base font-semibold text-gray-900">
        {cardText}
      </span>

      <span className="absolute bottom-1 right-1 text-xl max-md:text-base  font-semibold rotate-180 text-gray-900">
        {cardText}
      </span>
    </button>
  );
};

const OpponentCardComponent = () => {
  return (
    <div
      className={`
        w-32 h-48
        max-md:w-16 max-md:h-24 
        bg-white rounded-lg 
        shadow-lg border-2 border-gray-200 
        flex items-center justify-center 
        relative 
        transition-all duration-300 
      `}
    >
      <span className="text-5xl max-md:text-3xl font-bold text-gray-900">
        ?
      </span>

      <span className="absolute top-1 left-1 text-xl max-md:text-base font-semibold text-gray-900">
        ?
      </span>

      <span className="absolute bottom-1 right-1 text-xl max-md:text-base font-semibold rotate-180 text-gray-900">
        ?
      </span>
    </div>
  );
};

export const RevealedCardComponent = (props: { power: number }) => {
  return (
    <div
      className={`
        w-32 h-48
        max-md:w-16 max-md:h-24 
        bg-white rounded-lg 
        shadow-lg border-2 border-gray-200 
        flex items-center justify-center 
        relative 
        transition-all duration-300 
      `}
    >
      <span className="text-5xl max-md:text-3xl font-bold text-gray-900">
        {props.power}
      </span>

      <span className="absolute top-1 left-1 text-xl max-md:text-base font-semibold text-gray-900">
        {props.power}
      </span>

      <span className="absolute bottom-1 right-1 text-xl max-md:text-base font-semibold rotate-180 text-gray-900">
        {props.power}
      </span>
    </div>
  );
};

const CardComponentArea = () => {
  return (
    <div
      className={`
        w-32 h-48
        max-md:w-16 max-md:h-24 
        rounded-lg 
        border-2 border-dashed border-gray-200 
        flex items-center justify-center 
        relative 
      `}
    ></div>
  );
};

type ItemComponentProps = Item & {
  power?: number;
  currentCardId?: number;
  currentItemId: number | undefined;
  onClick: (itemId: number) => void;
};
const ItemComponent = (props: ItemComponentProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [pressProgress, setPressProgress] = useState(0);

  const PRESS_DURATION = 480;

  const isRestricted = isRestrictedPair({
    power: props.power,
    itemId: props.itemId,
  });

  useEffect(() => {
    if (!isPressed) {
      setPressProgress(0);
      return;
    }

    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / PRESS_DURATION) * 100, 100);
      setPressProgress(progress);

      if (progress >= 100) {
        setIsModalOpen(true);
        setIsPressed(false);
        clearInterval(interval);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [isPressed]);

  const startLongPress = () => {
    setIsPressed(true);
  };

  const endLongPress = () => {
    setIsPressed(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={() => props.onClick(props.itemId)}
        onMouseDown={startLongPress}
        onMouseUp={endLongPress}
        onMouseLeave={endLongPress}
        onTouchStart={(e) => {
          e.preventDefault();
          startLongPress();
        }}
        onTouchEnd={endLongPress}
        onTouchCancel={endLongPress}
        onContextMenu={(e) => e.preventDefault()}
        className={`
          w-12 h-12 
          bg-white
          rounded-lg 
          shadow-lg border-2 border-gray-200 
          flex items-center justify-center 
          relative 
          transition-all duration-300 
          cursor-pointer overflow-hidden
          ${isPressed ? "scale-105 shadow-xl" : ""}
          ${
            isRestricted
              ? "border-red-500 border-4"
              : `hover:shadow-xl ${
                  props.currentItemId === props.itemId
                    ? "border-sky-500 border-4"
                    : "border-gray-200 hover:border-sky-500 hover:border-4"
                }`
          }
        `}
        disabled={isRestricted}
      >
        <img
          src={props.itemImageUrl}
          alt={props.itemName}
          className="w-14 h-14 object-cover select-none"
          style={{
            WebkitUserSelect: "none",
            WebkitTouchCallout: "none",
            userSelect: "none",
          }}
          onDragStart={(e) => e.preventDefault()}
        />

        {isPressed && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
            <div
              className="h-full bg-blue-500 transition-all duration-75"
              style={{ width: `${pressProgress}%` }}
            />
          </div>
        )}

        {isPressed && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <div className="text-white text-xs font-medium">
              {Math.round(pressProgress)}%
            </div>
          </div>
        )}
      </button>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={closeModal} // モーダルの外側をクリックした時にもモーダルを閉じる
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
          onClick={(e) => e.stopPropagation()} //モーダル内のクリックでは閉じないように。
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                {props.itemName}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>

            <div className="p-4">
              <div className="flex justify-center mb-4">
                <img
                  src={props.itemImageUrl}
                  alt={props.itemName}
                  className="w-32 h-32 object-cover rounded-lg shadow-md"
                />
              </div>

              <h3 className="text-xl font-bold text-center text-gray-800 mb-3">
                {props.itemName}
              </h3>

              {props.itemEffect && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {props.itemEffect}
                  </p>
                </div>
              )}

              {!props.itemEffect && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-gray-500 text-sm text-center italic">
                    このアイテムの詳細情報はありません
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const RevealedItemComponent = (props: {
  itemName: string;
  itemImageUrl: string;
}) => {
  return (
    <div
      className={`
w-12 h-12 
bg-white
rounded-lg 
shadow-lg border-2 border-gray-200 
flex items-center justify-center 
relative 
transition-all duration-300 
overflow-hidden
`}
    >
      <img
        src={props.itemImageUrl}
        alt={props.itemName}
        className="w-14 h-14 object-cover"
      />
    </div>
  );
};
const ItemComponentArea = () => {
  return (
    <div
      className={`
w-12 h-12 
rounded-lg 
border-2 border-dashed border-gray-200 
flex items-center justify-center 
relative 
`}
    ></div>
  );
};

const AnimatedPowerChange = (props: {
  playerSelectedCardPower: number;
  playerSelectedItemId?: number;
  opponentSelectedItemId?: number;
}) => {
  const powerDiff = calculatePowerDiff({ ...props });

  if (powerDiff === 0) {
    return null;
  }

  let powerDiffText = `${powerDiff}`;
  if (powerDiff > 0) {
    powerDiffText = "+" + powerDiffText;
  }

  const bgColor = powerDiff > 0 ? "bg-blue-500" : "bg-red-500";
  const animationName = powerDiff > 0 ? "slideUpFadeOut" : "slideDownFadeOut";

  return (
    <>
      <style>
        {`
          @keyframes slideDownFadeOut {
            0% { opacity: 1; transform: translate(-30%, 0);}
            100% { opacity: 0; transform: translate(-30%, 2rem);}
          }
          @keyframes slideUpFadeOut {
            0% { opacity: 1; transform: translate(-30%, 0);}
            100% { opacity: 0; transform: translate(-30%, -4rem);}
          }
        `}
      </style>
      <div
        className={`
    absolute
    top-1/2
    left-0
    w-12 h-12
    flex items-center justify-center
    ${bgColor} text-white text-2xl font-bold
    rounded
    shadow-lg
    pointer-events-none
  `}
        style={{
          opacity: 0,
          transform: "translate(-50%, -50%)",
          animationFillMode: "forwards",
          animationDelay: "2s",
          animationDuration: "2s",
          animationName,
        }}
      >
        {powerDiffText}
      </div>
    </>
  );
};
