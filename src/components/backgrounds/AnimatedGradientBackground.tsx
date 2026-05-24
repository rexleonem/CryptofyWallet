import React, { ReactNode, useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

type AnimatedGradientBackgroundProps = {
  children?: ReactNode;
  intensity?: 'cinematic' | 'calm';
};

export default function AnimatedGradientBackground({
  children,
  intensity = 'calm',
}: AnimatedGradientBackgroundProps) {
  const drift = useSharedValue(0);
  const breathe = useSharedValue(0);
  const fade = useSharedValue(0);

  useEffect(() => {
    fade.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) });
    drift.value = withRepeat(
      withTiming(1, { duration: intensity === 'cinematic' ? 9000 : 12000, easing: Easing.inOut(Easing.cubic) }),
      -1,
      true,
    );
    breathe.value = withDelay(
      600,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.cubic) }),
          withTiming(0, { duration: 2600, easing: Easing.inOut(Easing.cubic) }),
        ),
        -1,
        false,
      ),
    );
  }, [breathe, drift, fade, intensity]);

  const gradientStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [
      { translateX: -width * 0.12 + drift.value * width * 0.24 },
      { translateY: -height * 0.08 + drift.value * height * 0.14 },
      { scale: 1.16 + breathe.value * 0.03 },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: (intensity === 'cinematic' ? 0.26 : 0.18) + breathe.value * 0.12,
    transform: [
      { translateX: -width * 0.12 + drift.value * width * 0.18 },
      { translateY: -height * 0.04 + drift.value * height * 0.08 },
      { scale: 0.95 + breathe.value * 0.1 },
    ],
  }));

  const lowerGlowStyle = useAnimatedStyle(() => ({
    opacity: 0.12 + drift.value * 0.1,
    transform: [
      { translateX: width * 0.08 - drift.value * width * 0.14 },
      { translateY: height * 0.02 - drift.value * height * 0.04 },
      { scale: 1.04 + breathe.value * 0.06 },
    ],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.gradient, gradientStyle]}>
        <LinearGradient
          colors={['#050816', '#081B3A', '#0A84FF', '#2563EB', '#3B82F6', '#050816']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <Animated.View style={[styles.primaryGlow, glowStyle]}>
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(165,216,255,0.86)', 'rgba(255,255,255,0)']}
          start={{ x: 0.1, y: 0.15 }}
          end={{ x: 1, y: 0.85 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <Animated.View style={[styles.lowerGlow, lowerGlowStyle]}>
        <LinearGradient
          colors={['rgba(10,132,255,0)', 'rgba(59,130,246,0.38)', 'rgba(255,255,255,0)']}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <View style={styles.veil} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
    backgroundColor: '#050816',
  },
  gradient: {
    position: 'absolute',
    top: -height * 0.12,
    left: -width * 0.18,
    width: width * 1.42,
    height: height * 1.36,
    overflow: 'hidden',
  },
  primaryGlow: {
    position: 'absolute',
    top: height * 0.04,
    left: -width * 0.15,
    width: width * 1.08,
    height: width * 1.08,
    borderRadius: width,
    overflow: 'hidden',
  },
  lowerGlow: {
    position: 'absolute',
    right: -width * 0.3,
    bottom: -height * 0.06,
    width: width * 1.1,
    height: width * 1.1,
    borderRadius: width,
    overflow: 'hidden',
  },
  veil: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(5,8,22,0.42)',
  },
});
