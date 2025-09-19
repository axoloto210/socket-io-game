import { ReactNode } from "react";

export const CardGameTable = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative h-5/6 bg-amber-800 p-4 max-md:h-1/2">
      <div className="absolute inset-0">
        <div className="h-5/6 w-full bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 max-md:h-1/2" />

        <div className="absolute inset-0 opacity-30">
          <div className="h-5/6 w-full bg-[repeating-linear-gradient(180deg,transparent_0px,rgba(0,0,0,0.1)_2px,transparent_4px)] max-md:h-1/2" />
        </div>

        <div className="absolute inset-0 opacity-20">
          <div className="h-5/6 w-full bg-[repeating-linear-gradient(45deg,transparent_0px,rgba(0,0,0,0.2)_1px,transparent_20px)] max-md:h-1/2" />
        </div>

        <div className="absolute inset-0 opacity-10">
          <div className="h-5/6 w-full bg-[repeating-linear-gradient(-45deg,transparent_0px,rgba(255,255,255,0.1)_1px,transparent_30px)] max-md:h-1/2" />
        </div>
      </div>

      <div className="relative h-5/6 min-h-full w-full rounded-lg border-8 border-amber-900 bg-green-800 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-green-700 to-green-800">
          <div className="absolute inset-0 opacity-5">
            <div className="h-5/6 w-full bg-[repeating-linear-gradient(45deg,#000000_0px,#000000_2px,transparent_2px,transparent_12px)]" />
          </div>
        </div>

        <div className="absolute inset-0 rounded-lg shadow-inner" />

        <div className="relative h-5/6 w-full p-6">{children}</div>
      </div>
    </div>
  );
};
