import { Socket } from "socket.io-client";
import { DEFAULT_CARD_ID, useCardGame } from "../hooks/useCardGame";
import { Card, Item } from "../common/src/types";
import { Dispatch, SetStateAction } from "react";
import { Heart } from "./Heart";

type CardGameProps = {
  socket: Socket;
  currentRoomId: string;
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
  } = useCardGame(socket);

  console.log(cardGameStatus);

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

  const clickDecideHandler = () => {
    if (selectedCardId === DEFAULT_CARD_ID) {
      return;
    }
    selectCard(selectedCardId, selectedItemId);
  };

  return (
    <>
      {playerStatus && (
        <>
          <div className="flex">あいて：{opponentStatus.userName}</div>
          <div className="flex">
            {[...Array(opponentStatus.hp)].map(() => (
              <div className="w-8 h-8">
                <Heart />
              </div>
            ))}
          </div>
          <div className="flex m-12">
            {[...Array(opponentStatus.hands.length)].map(() => {
              return <OpponentCardComponent />;
            })}
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="flex justify-center">
              {opponentSelectedCards?.card ? (
                <div>
                  <RevealedCardComponent
                    power={opponentSelectedCards.card.power}
                  />
                </div>
              ) : (
                <div>
                  <CardComponentArea />
                </div>
              )}
              {opponentSelectedCards?.item ? (
                <div>
                  <RevealedItemComponent
                    itemName={opponentSelectedCards.item.itemName}
                  />
                </div>
              ) : (
                <div>
                  <ItemComponentArea />
                </div>
              )}
            </div>
            <div className="text-center">VS</div>
            <div className="flex justify-center">
              {playerSelectedCards?.card ? (
                <div>
                  <RevealedCardComponent
                    power={playerSelectedCards.card.power}
                  />
                </div>
              ) : (
                <div>
                  <CardComponentArea />
                </div>
              )}
              {playerSelectedCards?.item ? (
                <div>
                  <RevealedItemComponent
                    itemName={playerSelectedCards.item.itemName}
                  />
                </div>
              ) : (
                <div>
                  <ItemComponentArea />
                </div>
              )}
            </div>
          </div>
          <div className="flex">じぶん：{playerStatus.userName}</div>
          <div className="flex">
            {[...Array(playerStatus.hp)].map(() => (
              <div className="w-8 h-8">
                <Heart />
              </div>
            ))}
          </div>
          <div className="flex m-12">
            {playerStatus.hands.map((hand) => {
              return (
                <CardComponent
                  {...hand}
                  currentCardId={selectedCardId}
                  onClick={setSelectedCardId}
                />
              );
            })}
          </div>
          <div className="flex m-4">
            {playerStatus.items.map((item) => {
              return (
                <ItemConponent
                  {...item}
                  currentItemId={selectedItemId}
                  onClick={setSelectedItemId}
                />
              );
            })}
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={clickDecideHandler}
          >
            けってい
          </button>
        </>
      )}
    </>
  );
};

const CardComponent = (
  props: Card & {
    currentCardId: number;
    onClick: Dispatch<SetStateAction<number>>;
  }
) => {
  const { cardId, power } = props;
  const cardText = power;

  return (
    <button
      onClick={() => props.onClick(cardId)}
      className={`
        w-32 h-48 
        rounded-lg 
        shadow-lg border-2 border-gray-200 
        flex items-center justify-center 
        relative 
        transition-all duration-300 
        cursor-pointer hover:shadow-xl hover:bg-sky-500
        ${cardId === props.currentCardId ? "bg-sky-300" : " bg-white"}
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

const OpponentCardComponent = () => {
  return (
    <div
      className={`
        w-32 h-48 
        bg-white rounded-lg 
        shadow-lg border-2 border-gray-200 
        flex items-center justify-center 
        relative 
        transition-all duration-300 
      `}
    >
      {/* Center number */}
      <span className="text-5xl font-bold text-gray-900">?</span>

      {/* Top left number */}
      <span className="absolute top-2 left-2 text-xl font-semibold text-gray-900">
        ?
      </span>

      {/* Bottom right number (rotated) */}
      <span className="absolute bottom-2 right-2 text-xl font-semibold rotate-180 text-gray-900">
        ?
      </span>
    </div>
  );
};

const RevealedCardComponent = (props: { power: number }) => {
  return (
    <div
      className={`
        w-32 h-48 
        bg-white rounded-lg 
        shadow-lg border-2 border-gray-200 
        flex items-center justify-center 
        relative 
        transition-all duration-300 
      `}
    >
      {/* Center number */}
      <span className="text-5xl font-bold text-gray-900">{props.power}</span>

      {/* Top left number */}
      <span className="absolute top-2 left-2 text-xl font-semibold text-gray-900">
        {props.power}
      </span>

      {/* Bottom right number (rotated) */}
      <span className="absolute bottom-2 right-2 text-xl font-semibold rotate-180 text-gray-900">
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
        rounded-lg 
        border-2 border-dashed border-gray-200 
        flex items-center justify-center 
        relative 
      `}
    ></div>
  );
};

type ItemConponentProps = Item & {
  currentItemId: number | undefined;
  onClick: Dispatch<SetStateAction<number | undefined>>;
};

const ItemConponent = (props: ItemConponentProps) => {
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
