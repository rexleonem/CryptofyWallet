import React, { useEffect } from 'react';
import { StatusBar, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { useAccountStore } from '../../store/walletStore';
import { COLORS } from '../../constants/Theme';
import AnimatedGradient from './AnimatedGradient';
import LogoAnimation from './LogoAnimation';
import { styles } from './styles';

export default function SplashScreen() {
  const navigation = useNavigation<any>();
  const { isAuthenticated } = useAccountStore();
  const taglineOpacity = useSharedValue(0);

  useEffect(() => {
    taglineOpacity.value = withDelay(1800, withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) }));
    const timer = setTimeout(() => {
      navigation.replace(isAuthenticated ? 'Main' : 'Auth');
    }, 3300);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigation, taglineOpacity]);

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <AnimatedGradient />
      <View style={styles.content}>
        <LogoAnimation />
      </View>
      <Animated.View style={[styles.taglineWrap, taglineStyle]}>
        <Text style={styles.tagline}>AI-Powered Crypto Intelligence</Text>
      </Animated.View>
    </View>
  );
}
