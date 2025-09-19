import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  playerName: string;
};

export const PlayerNamePlate = ({ children, playerName }: Props) => {
  return (
    <div className="absolute inset-0 top-1/2 mr-auto w-36 -translate-y-1/2 max-md:left-[-20px] max-md:w-24">
      <div className="rounded bg-gradient-to-r from-gray-600 via-gray-300 to-gray-600 p-[2px]">
        <div className="relative rounded bg-gradient-to-b from-gray-100 to-gray-300">
          <div className="absolute inset-0 rounded bg-gradient-to-t from-black/5 to-transparent" />

          <div className="relative px-1 py-1">
            <div className="mb-1 flex items-center justify-center gap-2">
              <div className="h-2 w-2 rounded-full bg-gray-500 shadow-inner" />
              <span className="min-w-[100px] text-center font-bold text-gray-800 max-md:min-w-[70px]">
                {playerName || "???"}
              </span>
              <div className="h-2 w-2 rounded-full bg-gray-500 shadow-inner" />
            </div>

            <div className="border-t border-gray-400/30 pt-1">
              <div className="flex justify-center gap-2">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
