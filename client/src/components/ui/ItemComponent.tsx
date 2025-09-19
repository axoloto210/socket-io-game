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
        100,
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
        className={`relative flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-gray-200 bg-white shadow-lg transition-all duration-300 ${isPressed ? "scale-105 shadow-xl" : ""} ${
          isRestricted
            ? "border-4 border-red-500"
            : `hover:shadow-xl ${
                props.currentItemId === props.itemId
                  ? "border-4 border-sky-500"
                  : "border-gray-200 hover:border-4 hover:border-sky-500"
              }`
        } `}
        disabled={isRestricted}
        style={{ touchAction: "manipulation" }}
      >
        <img
          src={props.itemImageUrl}
          alt={props.itemName}
          className="h-14 w-14 select-none object-cover"
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
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
            <div className="text-xs font-medium text-white">
              {Math.round(pressProgress)}%
            </div>
          </div>
        )}
      </button>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={closeModal}
        >
          <div
            className="mx-4 w-full max-w-md rounded-lg bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {props.itemName}
              </h2>
              <button
                onClick={closeModal}
                className="flex h-6 w-6 items-center justify-center text-gray-400 transition-colors hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="p-4">
              <div className="mb-4 flex justify-center">
                <img
                  src={props.itemImageUrl}
                  alt={props.itemName}
                  className="h-32 w-32 rounded-lg object-cover shadow-md"
                />
              </div>

              <h3 className="mb-3 text-center text-xl font-bold text-gray-800">
                {props.itemName}
              </h3>

              {props.itemEffect && (
                <div className="mb-4 rounded-lg bg-gray-50 p-3">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                    {props.itemEffect}
                  </p>
                </div>
              )}

              {!props.itemEffect && (
                <div className="mb-4 rounded-lg bg-gray-50 p-3">
                  <p className="text-center text-sm italic text-gray-500">
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
