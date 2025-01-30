import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  isLoading: boolean;
};

export const LoadingOverlay = ({ children, isLoading = false }: Props) => {
  return (
    <div className="relative p-8">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <span
            className="
          inline-block 
          text-xl 
          loading-blink
        "
            style={{ color: "#D4B840" }}
          >
            たいきちゅう
          </span>
        </div>
      )}
      {/** tailwindCSSでは@keyframesをclassNameに直接指定できない。 */}
      <style>
        {`
          .loading-blink {
            animation: smoothBlink 2s ease-in-out infinite;
          }

          @keyframes smoothBlink {
            0% { opacity: 0.3; }
            50% { opacity: 1; }
            100% { opacity: 0.3; }
          }
        `}
      </style>
    </div>
  );
};
