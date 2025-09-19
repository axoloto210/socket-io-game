import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  isLoading: boolean;
};

export const LoadingOverlay = ({ children, isLoading = false }: Props) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <span
            className="loading-blink inline-block text-xl"
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
