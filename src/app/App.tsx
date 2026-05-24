import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, StatusBar } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { COLORS } from '../constants/Theme';
import { useAccountStore } from '../store/walletStore';

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

  try {
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
