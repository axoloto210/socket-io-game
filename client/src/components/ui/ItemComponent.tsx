import { isRestrictedPair } from "@socket-io-game/common";
import { Item } from "@socket-io-game/common/src/types";
import { useEffect, useState } from "react";

type ItemComponentProps = Item & {
  power?: number;
  currentCardId?: number;
  currentItemId: number | undefined;
  onClick: (itemId: number) => void;
};

const PRESS_DURATION = 480;
const PROGRESS_SHOW_DELAY = 240;

export const ItemComponent = (props: ItemComponentProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [pressedTime, setPressedTime] = useState(0);

  const isRestricted = isRestrictedPair({
    power: props.power,
    itemId: props.itemId,
  });

  useEffect(() => {
    if (!isPressed) {
      setPressedTime(0);
      return;
    }

    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setPressedTime(elapsed);

      if (elapsed >= PRESS_DURATION) {
        setIsModalOpen(true);
        setIsPressed(false);
        clearInterval(interval);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [isPressed]);

  const isProgressShown = pressedTime >= PROGRESS_SHOW_DELAY;
  const pressProgress = isProgressShown
    ? Math.min(
        ((pressedTime - PROGRESS_SHOW_DELAY) /
          (PRESS_DURATION - PROGRESS_SHOW_DELAY)) *
          100,
        100
      )
    : 0;

  const handlePressStart = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsPressed(true);
  };

  const handlePressEnd = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsPressed(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={() => props.onClick(props.itemId)}
        onPointerDown={handlePressStart}
        onPointerUp={handlePressEnd}
        onPointerLeave={handlePressEnd}
        onPointerCancel={handlePressEnd}
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
        style={{ touchAction: "manipulation" }}
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

        {isProgressShown && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
            <div
              className="h-full bg-blue-500 transition-all duration-75"
              style={{ width: `${pressProgress}%` }}
            />
          </div>
        )}

        {isProgressShown && (
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
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
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
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {props.itemEffect}
                  </p>
                </div>
              )}

              {!props.itemEffect && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-gray-500 text-sm text-center italic">
                    No Caption.
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
