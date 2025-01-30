import { ReactNode } from "react";

type Props = {
    children: ReactNode,
    playerName: string,
}

export const PlayerNamePlate = ({ children, playerName }: Props) => {
    return (
      <div className="inline-block">
        <div className="bg-gradient-to-r from-gray-600 via-gray-300 to-gray-600 p-[2px] rounded">
          <div className="bg-gradient-to-b from-gray-100 to-gray-300 rounded relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent rounded" />
            
            <div className="relative px-4 py-2">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-gray-500 shadow-inner" />
                <span className="text-gray-800 font-bold text-center min-w-[100px]">
                  {playerName || "???"}
                </span>
                <div className="w-2 h-2 rounded-full bg-gray-500 shadow-inner" />
              </div>
  
              <div className="pt-1 border-t border-gray-400/30">
                <div className="flex justify-center gap-2">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  