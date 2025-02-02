import { ReactNode } from "react";

export const CardGameTable = ({ children }:{children: ReactNode}) => {
    return (
      <div className="h-5/6 max-md:h-1/2 relative p-4 bg-amber-800">
        <div className="absolute inset-0">
          <div className="h-5/6 max-md:h-1/2 w-full bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800" />
          
          <div className="absolute inset-0 opacity-30">
            <div className="h-5/6 max-md:h-1/2 w-full bg-[repeating-linear-gradient(180deg,transparent_0px,rgba(0,0,0,0.1)_2px,transparent_4px)]" />
          </div>
          
          <div className="absolute inset-0 opacity-20">
            <div className="h-5/6 max-md:h-1/2 w-full bg-[repeating-linear-gradient(45deg,transparent_0px,rgba(0,0,0,0.2)_1px,transparent_20px)]" />
          </div>
          
          <div className="absolute inset-0 opacity-10">
            <div className="h-5/6 max-md:h-1/2 w-full bg-[repeating-linear-gradient(-45deg,transparent_0px,rgba(255,255,255,0.1)_1px,transparent_30px)]" />
          </div>
        </div>
        
        <div className="relative h-5/6 w-full min-h-full bg-green-800 border-8 border-amber-900 rounded-lg shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-green-700 to-green-800">
            <div className="absolute inset-0 opacity-5">
              <div className="h-5/6 w-full bg-[repeating-linear-gradient(45deg,#000000_0px,#000000_2px,transparent_2px,transparent_12px)]" />
            </div>
          </div>
  
          <div className="absolute inset-0 shadow-inner rounded-lg" />
  
          <div className="relative h-5/6 w-full p-6">
            {children}
          </div>
        </div>
      </div>
    );
  };
