import { ReactNode } from "react";

type Props = {
    children: ReactNode,
    playerName: string,
}

export const PlayerNamePlate = ({ children, playerName }: Props) => {
    return (
      <div className="absolute inset-0 w-36 max-md:w-24 max-md:left-[-20px] mr-auto top-1/2 -translate-y-1/2">
        <div className="bg-gradient-to-r from-gray-600 via-gray-300 to-gray-600 p-[2px] rounded">
          <div className="bg-gradient-to-b from-gray-100 to-gray-300 rounded relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent rounded" />
            
            <div className="relative px-1 py-1">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-gray-500 shadow-inner" />
                <span className="text-gray-800 font-bold text-center min-w-[100px] max-md:min-w-[70px]">
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
  