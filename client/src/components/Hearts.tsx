import { MAX_HP } from "@socket-io-game/common";
import { Heart } from "./Heart";
import { useEffect, useState } from "react";

export const Hearts = ({ hp }: { hp: number }) => {
  const [previousHp, setPreviousHp] = useState(MAX_HP);

  const [isBlinking, setIsBlinking] = useState(false);

  const damage = hp >= 0 ? previousHp - hp : previousHp;

  useEffect(() => {
    setIsBlinking(true);
    

    setTimeout(() => {
      setIsBlinking(false);
      setPreviousHp(hp)
    }, 2000);
  }, [hp]);

  return (
    <>
    {isBlinking || hp > 0 ? <>
      {[...Array(Math.max(hp, 0))].map(() => (
        <div className="w-8 h-8 max-md:w-4 max-md:h-4">
          <Heart />
        </div>
      ))}
      {[...Array(Math.max(damage, 0))].map(() => (
        <div className="w-8 h-8 max-md:w-4 max-md:h-4">
          <Heart isBlinking={true}/>
        </div>
      ))}
      {[...Array(Math.max(MAX_HP - hp - damage, 0))].map(() => (
        <div className="w-8 h-8 max-md:w-4 max-md:h-4">
          <Heart isEmpty={true} />
        </div>
      ))}
    </>
    :<>
      {[...Array(Math.max(hp, 0))].map(() => (
        <div className="w-8 h-8 max-md:w-4 max-md:h-4">
          <Heart/>
        </div>
      ))}
      {[...Array(Math.max(MAX_HP - hp, 0))].map(() => (
        <div className="w-8 h-8 max-md:w-4 max-md:h-4">
          <Heart isEmpty={true}/>
        </div>
      ))}
      </>
    }
    </>
  );
};
