import { ReactNode, useState } from "react";

type RoomModeButtonProps = {
  icon: string;
  color: string;
  children: ReactNode;
  onClick: () => void;
};

export const RoomModeButton = (props: RoomModeButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className="relative flex h-16 w-3/5 cursor-pointer items-center outline-none focus:outline-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)} // フォーカス時にもホバー状態に
      onBlur={() => setIsHovered(false)} // フォーカスが外れた時にホバー状態を解除
      onClick={props.onClick}
      style={{
        transform: isHovered ? "translateX(36px)" : "translateX(0)",
        transition: "transform 0.3s ease",
        background: "transparent",
        border: "none",
      }}
    >
      <div
        className="absolute inset-0 skew-x-12 rounded-r-xl shadow-md"
        style={{ backgroundColor: props.color, border: "2px solid black" }}
      ></div>
      <div className="absolute left-6 z-10 flex h-full items-center">
        <img src={`/${props.icon}.svg`} width={48} height={48} />
        <span
          className="ml-4 text-2xl font-bold text-black"
          style={{
            textShadow:
              "-1px -1px 0 #FFF, 1px -1px 0 #FFF, -1px 1px 0 #FFF, 1px 1px 0 #FFF, 0px -2px 0 #FFF, 0px 2px 0 #FFF, -2px 0px 0 #FFF, 2px 0px 0 #FFF",
          }}
        >
          {props.children}
        </span>
      </div>
    </button>
  );
};
