export const Heart = ({
  isEmpty,
  isBlinking,
}: {
  isEmpty?: boolean;
  isBlinking?: boolean;
}) => {
  const heartColor = isEmpty ? "#A9A9A9" : "#FF0000";

  const blinkingStyle = isBlinking
    ? {
        animation: "blinkingHeart 0.5s linear infinite alternate",
      }
    : {};

  return (
    <>
      {isBlinking && (
        <style>
          {`
          @keyframes blinkingHeart {
            0% { opacity: 1; }
            100% { opacity: 0.2; }
          }
        `}
        </style>
      )}

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        style={blinkingStyle}
      >
        <path
          d="M50 80
       C50 80, 85 55, 85 35
       C85 15, 65 10, 50 30
       C35 10, 15 15, 15 35
       C15 55, 50 80, 50 80Z"
          fill={heartColor}
          stroke={isEmpty ? "none" : "#87CEEB"}
          strokeWidth="4"
        />
        <path
          d="M50 75
       C50 75, 80 52, 80 35
       C80 18, 65 15, 50 32
       C35 15, 20 18, 20 35
       C20 52, 50 75, 50 75Z"
          fill={heartColor}
          stroke="none"
        />
      </svg>
    </>
  );
};
