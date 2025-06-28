import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import Svg, { Path } from "react-native-svg";

export const Heart = ({
  isEmpty,
  isBlinking,
  size = 16,
}: {
  isEmpty?: boolean;
  isBlinking?: boolean;
  size?: number;
}) => {
  const heartColor = isEmpty ? "#A9A9A9" : "#FF0000";
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isBlinking) {
      // 点滅アニメーション
      const blinkAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 0.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      blinkAnimation.start();

      return () => blinkAnimation.stop();
    } else {
      // 点滅停止時は元の透明度に戻す
      blinkAnim.setValue(1);
    }
  }, [isBlinking, blinkAnim]);

  return (
    <Animated.View style={{ opacity: isBlinking ? blinkAnim : 1, width: size, height: size }}>
      <Svg viewBox="0 0 100 100" width={size} height={size}>
        <Path
          d="M50 80
             C50 80, 85 55, 85 35
             C85 15, 65 10, 50 30
             C35 10, 15 15, 15 35
             C15 55, 50 80, 50 80Z"
          fill={heartColor}
          stroke={isEmpty ? "none" : "#87CEEB"}
          strokeWidth="4"
        />
        <Path
          d="M50 75
             C50 75, 80 52, 80 35
             C80 18, 65 15, 50 32
             C35 15, 20 18, 20 35
             C20 52, 50 75, 50 75Z"
          fill={heartColor}
          stroke="none"
        />
      </Svg>
    </Animated.View>
  );
};