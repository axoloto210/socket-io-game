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
    (key) => key !== socket.id,
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

            <div className="mb-2 ml-2 mr-2 flex items-center justify-center">
              {[...Array(opponentStatus.hands.length)].map(() => {
                return <OpponentCardComponent />;
              })}
            </div>
            <div className="mb-2 flex flex-col items-center justify-center">
              <div className="relative mt-4 flex min-w-full justify-center">
                <PlayerNamePlate playerName={opponentStatus.userName}>
                  <Hearts hp={opponentStatus.hp} />
                </PlayerNamePlate>
                <div className="mx-auto flex justify-center pl-12">
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
              <div className="relative mt-2 flex min-w-full">
                <PlayerNamePlate playerName={playerStatus.userName}>
                  <Hearts hp={playerStatus.hp} />
                </PlayerNamePlate>
                <div className="mx-auto flex justify-center pl-12">
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
                  className="absolute right-2 top-1/2 mb-16 ml-auto mt-16 h-12 w-16 -translate-y-1/2 rounded bg-blue-500 px-4 py-2 text-white max-md:right-[-12px] max-md:mb-4 max-md:mt-4 max-md:px-2 max-md:py-1 max-md:text-[16px]"
                  onClick={handleDecideClick}
                >
                  SET
                </button>
              </div>
            </div>
            <LoadingOverlay isLoading={isCardDecided}>
              <div className="mb-2 ml-2 mr-2 flex items-center justify-center">
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
              <div className="ml-2 mr-2 mt-2 flex">
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
      className={`relative flex h-48 w-32 cursor-pointer items-center justify-center rounded-lg border-2 border-gray-200 shadow-lg transition-all duration-300 hover:bg-sky-500 hover:shadow-xl max-md:h-24 max-md:w-16 ${cardId === props.currentCardId ? "bg-sky-300" : "bg-white"} `}
    >
      <span className="text-5xl font-bold text-gray-900 max-md:text-3xl">
        {cardText}
      </span>

      <span className="absolute left-1 top-1 text-xl font-semibold text-gray-900 max-md:text-base">
        {cardText}
      </span>

      <span className="absolute bottom-1 right-1 rotate-180 text-xl font-semibold text-gray-900 max-md:text-base">
        {cardText}
      </span>
    </button>
  );
};

const OpponentCardComponent = () => {
  return (
    <div
      className={`relative flex h-48 w-32 items-center justify-center rounded-lg border-2 border-gray-200 bg-white shadow-lg transition-all duration-300 max-md:h-24 max-md:w-16`}
    >
      <span className="text-5xl font-bold text-gray-900 max-md:text-3xl">
        ?
      </span>

      <span className="absolute left-1 top-1 text-xl font-semibold text-gray-900 max-md:text-base">
        ?
      </span>

      <span className="absolute bottom-1 right-1 rotate-180 text-xl font-semibold text-gray-900 max-md:text-base">
        ?
      </span>
    </div>
  );
};

export const RevealedCardComponent = (props: { power: number }) => {
  return (
    <div
      className={`relative flex h-48 w-32 items-center justify-center rounded-lg border-2 border-gray-200 bg-white shadow-lg transition-all duration-300 max-md:h-24 max-md:w-16`}
    >
      <span className="text-5xl font-bold text-gray-900 max-md:text-3xl">
        {props.power}
      </span>

      <span className="absolute left-1 top-1 text-xl font-semibold text-gray-900 max-md:text-base">
        {props.power}
      </span>

      <span className="absolute bottom-1 right-1 rotate-180 text-xl font-semibold text-gray-900 max-md:text-base">
        {props.power}
      </span>
    </div>
  );
};

const CardComponentArea = () => {
  return (
    <div
      className={`relative flex h-48 w-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 max-md:h-24 max-md:w-16`}
    ></div>
  );
};

const RevealedItemComponent = (props: {
  itemName: string;
  itemImageUrl: string;
}) => {
  return (
    <div
      className={`relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border-2 border-gray-200 bg-white shadow-lg transition-all duration-300`}
    >
      <img
        src={props.itemImageUrl}
        alt={props.itemName}
        className="h-14 w-14 object-cover"
      />
    </div>
  );
};
const ItemComponentArea = () => {
  return (
    <div
      className={`relative flex h-12 w-12 items-center justify-center rounded-lg border-2 border-dashed border-gray-200`}
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
        className={`absolute left-0 top-1/2 flex h-12 w-12 items-center justify-center ${bgColor} pointer-events-none rounded text-2xl font-bold text-white shadow-lg`}
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
