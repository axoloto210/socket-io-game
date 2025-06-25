import { GAME_RESULTS, GameResult } from "../../hooks/useCardGame";
import { ReturnTopButton } from "./ReturnTopButton";

export const GameEnd = (props: {
  gameResult: GameResult;
}) => {
  const gameResult = props.gameResult;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className={`text-8xl font-bold animate-bounce ${
          gameResult === GAME_RESULTS.WIN
            ? "text-yellow-300"
            : gameResult === GAME_RESULTS.LOSE
            ? "text-blue-500"
            : "text-green-400"
        }`}
      >
        {gameResult === GAME_RESULTS.WIN
          ? "WIN!"
          : gameResult === GAME_RESULTS.LOSE
          ? "LOSE.."
          : "DRAW"}
      </div>
      <ReturnTopButton />
    </div>
  );
};
