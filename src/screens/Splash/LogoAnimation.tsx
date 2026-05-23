import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export default function LogoAnimation() {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const pulse = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(1000, withTiming(1, { duration: 1200, easing: Easing.out(Easing.cubic) }));
    scale.value = withDelay(1000, withTiming(1, { duration: 1200, easing: Easing.out(Easing.cubic) }));
    pulse.value = withDelay(
      2000,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.cubic) }),
          withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.cubic) }),
        ),
        -1,
        false,
      ),
    );
  }, [opacity, pulse, scale]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.18 + pulse.value * 0.22,
    transform: [{ scale: 0.86 + pulse.value * 0.18 }],
  }));

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.logoGlow, glowStyle]} />
      <Animated.View style={logoStyle}>
        <Image source={require('../../assets/cfywallet-logo-white.png')} style={styles.logo} resizeMode="contain" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 240,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGlow: {
    position: 'absolute',
    width: 210,
    height: 104,
    borderRadius: 52,
    backgroundColor: '#A5D8FF',
    shadowColor: '#A5D8FF',
    shadowOpacity: 0.8,
    shadowRadius: 36,
    shadowOffset: { width: 0, height: 0 },
  },
  logo: {
    width: 210,
    height: 96,
  },
});
