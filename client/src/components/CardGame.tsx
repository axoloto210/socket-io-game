import { Socket } from "socket.io-client";
import { DEFAULT_CARD, GAME_RESULTS, useCardGame } from "../hooks/useCardGame";
import {
  Card,
  calculatePowerDiff,
  isRestrictedPair,
} from "@socket-io-game/common";
import { Dispatch, SetStateAction } from "react";
import { LoadingOverlay } from "./ui/LoadingOverlay";
import { CardGameTable } from "./CardGameTable";
import { PlayerNamePlate } from "./ui/PlayerNamePlate";
import { WaitingOpponent } from "./ui/WaitingOpponent";
import { Hearts } from "./ui/Hearts";
import { GameEnd } from "./ui/GameEnd";
import { ItemComponent } from "./ui/ItemComponent";

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
