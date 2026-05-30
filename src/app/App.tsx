import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, StatusBar } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { COLORS } from '../constants/Theme';
import { useAccountStore } from '../store/walletStore';
import { apiClient } from '../api/client';
import { clearTokens, getTokens } from '../api/tokenStore';

// Screen imports
import SplashScreen from '../screens/Splash/SplashScreen';
import AuthScreen from '../screens/Auth/AuthScreen';
import MainTabNavigator from '../navigation';
import SendScreen from '../screens/Transactions/SendScreen';
import ConfirmScreen from '../screens/Transactions/ConfirmScreen';
import ReceiveScreen from '../screens/Transactions/ReceiveScreen';
import HistoryScreen from '../screens/Transactions/HistoryScreen';
import TokenDetailScreen from '../screens/Portfolio/TokenDetailScreen';
import InsightsDetailScreen from '../screens/Insights/InsightsDetailScreen';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  const isAuthenticated = useAccountStore((state) => state.isAuthenticated);
  const signIn = useAccountStore((state) => state.signIn);
  const signOut = useAccountStore((state) => state.signOut);
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const tokens = await getTokens();
        if (!tokens) {
          if (mounted) setBooted(true);
          return;
        }
        const me = await apiClient.get('/auth/me').then((r) => r.data).catch(() => null);
        if (!me?.email || !me?.id) {
          await clearTokens();
          signOut();
          if (mounted) setBooted(true);
          return;
        }
        const walletAddress = me.wallets?.[0]?.address || null;
        signIn(me.email, me.name || me.email.split('@')[0], me.id, walletAddress);
      } finally {
        if (mounted) setBooted(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [signIn, signOut]);

  try {
    if (!booted) {
      return (
        <SafeAreaProvider>
          <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background }}>
            <Text style={{ color: 'rgba(255,255,255,0.7)' }}>Loading…</Text>
          </View>
        </SafeAreaProvider>
      );
    }
    return (
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
          <NavigationContainer>
            <Stack.Navigator 
              initialRouteName="Splash"
              screenOptions={{ 
                headerShown: false,
                animation: 'fade',
                contentStyle: { backgroundColor: COLORS.background }
              }}
            >
              <Stack.Screen name="Splash" component={SplashScreen} />
              {isAuthenticated ? (
                <>
                  <Stack.Screen name="Main" component={MainTabNavigator} />
                  <Stack.Screen name="Send" component={SendScreen} />
                  <Stack.Screen name="ConfirmTransaction" component={ConfirmScreen} />
                  <Stack.Screen name="Receive" component={ReceiveScreen} />
                  <Stack.Screen name="History" component={HistoryScreen} />
                  <Stack.Screen name="TokenDetail" component={TokenDetailScreen} />
                  <Stack.Screen name="InsightsDetail" component={InsightsDetailScreen} />
                </>
              ) : (
                <Stack.Screen name="Auth" component={AuthScreen} />
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </QueryClientProvider>
      </SafeAreaProvider>
    );
  } catch (error) {
    const err = error as any;
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0B0F1A' }}>
        <Text style={{ color: 'white' }}>App Error: {err?.message || 'Unknown error'}</Text>
      </View>
    );
  }
}
