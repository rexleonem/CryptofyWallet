import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { COLORS } from '../../constants/Theme';
import CryptofyIcon, { CryptofyIconName } from './CryptofyIcon';

interface TabBarIconProps {
  name: CryptofyIconName;
  focused: boolean;
  isPrimary?: boolean;
}

export default function TabBarIcon({ name, focused, isPrimary }: TabBarIconProps) {
  const progress = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(focused ? 1 : 0, {
      damping: 18,
      stiffness: 190,
      mass: 0.75,
    });
  }, [focused, progress]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(progress.value, [0, 1], [1, isPrimary ? 1.12 : 1.08]) }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: withTiming(interpolate(progress.value, [0, 1], [0, isPrimary ? 0.34 : 0.22]), { duration: 180 }),
  }));

  const color = focused ? COLORS.primary : 'rgba(255,255,255,0.45)';

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.View style={[styles.glow, isPrimary && styles.primaryGlow, glowStyle]} />
      <View style={[styles.iconShell, focused && styles.iconShellActive, isPrimary && styles.primaryShell]}>
        <CryptofyIcon name={name} size={isPrimary ? 24 : 22} color={color} strokeWidth={focused ? 2.05 : 1.85} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 48,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 42,
    height: 30,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
  },
  primaryGlow: {
    width: 50,
    height: 34,
    borderRadius: 22,
  },
  iconShell: {
    width: 38,
    height: 34,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconShellActive: {
    backgroundColor: 'rgba(10,132,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(165,216,255,0.16)',
  },
  primaryShell: {
    width: 44,
    height: 38,
    borderRadius: 18,
  },
});
