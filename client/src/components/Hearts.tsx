import { MAX_HP } from "@socket-io-game/common";
import { Heart } from "./Heart";

export const Hearts = ({ hp }: { hp: number }) => {
  return (
    <>
      {[...Array(hp)].map(() => (
        <div className="w-8 h-8 max-md:w-4 max-md:h-4">
          <Heart />
        </div>
      ))}
      {[...Array(MAX_HP - hp)].map(() => (
        <div className="w-8 h-8 max-md:w-4 max-md:h-4">
          <Heart isEmpty={true}/>
        </div>
      ))}
    </>
  );
};
