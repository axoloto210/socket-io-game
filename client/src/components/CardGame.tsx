import { Socket } from "socket.io-client";
import {
  DEFAULT_CARD_ID,
  GAME_RESULTS,
  useCardGame,
} from "../hooks/useCardGame";
import { Card, Item } from "@socket-io-game/common";
import { Dispatch, SetStateAction } from "react";
import { LoadingOverlay } from "./LoadingOverlay";
import { CardGameTable } from "./CardGameTable";
import { PlayerNamePlate } from "./PlayerNamePlate";
import { WaitingOpponent } from "./WaitingOpponent";
import { Hearts } from "./Hearts";

type CardGameProps = {
  socket: Socket;
};

export const CardGame = (props: CardGameProps) => {
  const { socket } = props;

  const {
    cardGameStatus,
    selectCard,
    selectedCardId,
    setSelectedCardId,
    selectedItemId,
    setSelectedItemId,
    isCardDecided,
    setIsCardDecided,
    getGameResult,
  } = useCardGame(socket);

  const playerStatus = cardGameStatus.playerStatuses[socket.id!];

  const playerSelectedCards = cardGameStatus.selectedCards
    ? cardGameStatus.selectedCards[socket.id!]
    : undefined;

  const opponentStatusKey = Object.keys(cardGameStatus.playerStatuses).filter(
    (key) => key !== socket.id!
  )[0];

  const opponentStatus = cardGameStatus.playerStatuses[opponentStatusKey];

  const opponentSelectedCards = cardGameStatus.selectedCards
    ? cardGameStatus.selectedCards[opponentStatusKey]
    : undefined;

  const gameResult = getGameResult(opponentStatus?.hp);

  const handleDecideClick = () => {
    if (selectedCardId === DEFAULT_CARD_ID) {
      return;
    }
    setIsCardDecided(true);
    setTimeout(() => {
      selectCard(selectedCardId, selectedItemId);
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
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div
                  className={`text-8xl font-bold animate-bounce ${
                    gameResult === GAME_RESULTS.WIN
                      ? "text-yellow-300"
                      : "text-blue-500"
                  }`}
                >
                  {gameResult === GAME_RESULTS.WIN ? "YOU WIN!" : "YOU LOSE.."}
                </div>
              </div>
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
                    <RevealedCardComponent
                      power={opponentSelectedCards.card.power}
                    />
                  ) : (
                    <CardComponentArea />
                  )}
                  <div>
                    {opponentSelectedCards?.item ? (
                      <RevealedItemComponent
                        itemName={opponentSelectedCards.item.itemName}
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
                    <RevealedCardComponent
                      power={playerSelectedCards.card.power}
                    />
                  ) : (
                    <CardComponentArea />
                  )}
                  <div>
                    {playerSelectedCards?.item ? (
                      <RevealedItemComponent
                        itemName={playerSelectedCards.item.itemName}
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
                      {...hand}
                      currentCardId={selectedCardId}
                      currentItemId={selectedItemId}
                      onClick={setSelectedCardId}
                    />
                  );
                })}
              </div>
              <div className="flex ml-2 mr-2 mt-2">
                {playerStatus.items.map((item) => {
                  return (
                    <ItemConponent
                      {...item}
                      currentCardId={selectedCardId}
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

const CardComponent = (
  props: Card & {
    currentCardId: number;
    currentItemId?: number;
    onClick: Dispatch<SetStateAction<number>>;
  }
) => {
  const { cardId, power } = props;
  const cardText = power;

  const isRestrictedPair = props.currentItemId === 2 && props.cardId === 5; //TODO 定数化

  return (
    <button
      onClick={() => props.onClick(cardId)}
      disabled={isRestrictedPair}
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

type ItemConponentProps = Item & {
  currentCardId?: number;
  currentItemId: number | undefined;
  onClick: (itemId: number) => void;
};

const ItemConponent = (props: ItemConponentProps) => {
  const isRestrictedPair = props.currentCardId === 5 && props.itemId === 2;
  return (
    <button
      onClick={() => props.onClick(props.itemId)}
      className={`
  w-12 h-12 
  rounded-lg 
  shadow-lg border-2 border-gray-200 
  flex items-center justify-center 
  relative 
  transition-all duration-300 
  cursor-pointer hover:shadow-xl hover:bg-sky-500
  ${props.currentItemId === props.itemId ? "bg-sky-300" : " bg-white"}
`}
      disabled={isRestrictedPair}
    >
      {props.itemName}
    </button>
  );
};

const RevealedItemComponent = (props: { itemName: string }) => {
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
`}
    >
      {props.itemName}
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
