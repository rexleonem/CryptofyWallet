import React, { useEffect } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function AnimatedGradient() {
  const drift = useSharedValue(0);
  const fade = useSharedValue(0);

  useEffect(() => {
    fade.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) });
    drift.value = withRepeat(
      withTiming(1, { duration: 9000, easing: Easing.inOut(Easing.cubic) }),
      -1,
      true,
    );
  }, [drift, fade]);

  const baseStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [
      { translateX: -width * 0.12 + drift.value * width * 0.24 },
      { translateY: -height * 0.06 + drift.value * height * 0.12 },
      { scale: 1.16 },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.22 + drift.value * 0.16,
    transform: [{ scale: 1.05 + drift.value * 0.08 }],
  }));

  return (
    <>
      <AnimatedLinearGradient
        colors={['#050816', '#0A84FF', '#2563EB', '#3B82F6', '#050816']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, baseStyle]}
      />
      <AnimatedLinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(165,216,255,0.9)', 'rgba(255,255,255,0)']}
        start={{ x: 0.1, y: 0.2 }}
        end={{ x: 1, y: 0.85 }}
        style={[styles.glow, glowStyle]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: width * 1.3,
    height: height * 1.3,
  },
  glow: {
    position: 'absolute',
    width: width * 0.95,
    height: width * 0.95,
    borderRadius: width,
  },
});
