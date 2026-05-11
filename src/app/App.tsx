import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, StatusBar } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useWalletStore } from '../store/walletStore';
import { COLORS } from '../constants/Theme';

// Screen imports
import SplashScreen from '../screens/Splash/SplashScreen';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import CreateWalletScreen from '../screens/Wallet/CreateWalletScreen';
import VerifyPhraseScreen from '../screens/Wallet/VerifyPhraseScreen';
import ImportWalletScreen from '../screens/Wallet/ImportWalletScreen';
import MainTabNavigator from '../navigation/MainTabNavigator';
import SendScreen from '../screens/Transactions/SendScreen';
import ConfirmScreen from '../screens/Transactions/ConfirmScreen';
import ReceiveScreen from '../screens/Transactions/ReceiveScreen';
import HistoryScreen from '../screens/Transactions/HistoryScreen';
import TokenDetailScreen from '../screens/Portfolio/TokenDetailScreen';
import InsightsDetailScreen from '../screens/Insights/InsightsDetailScreen';
import SubscriptionScreen from '../screens/Subscription/SubscriptionScreen';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  try {
    const { address, isUnlocked } = useWalletStore();

    return (
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
          <NavigationContainer>
            <Stack.Navigator 
              initialRouteName="Splash"
              screenOptions={{ 
                headerShown: false,
                contentStyle: { backgroundColor: COLORS.background }
              }}
            >
              <Stack.Screen name="Splash" component={SplashScreen} />
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
              <Stack.Screen name="CreateWallet" component={CreateWalletScreen} />
              <Stack.Screen name="VerifyPhrase" component={VerifyPhraseScreen} />
              <Stack.Screen name="ImportWallet" component={ImportWalletScreen} />
              <Stack.Screen name="Main" component={MainTabNavigator} />
              <Stack.Screen name="Send" component={SendScreen} />
              <Stack.Screen name="ConfirmTransaction" component={ConfirmScreen} />
              <Stack.Screen name="Receive" component={ReceiveScreen} />
              <Stack.Screen name="History" component={HistoryScreen} />
              <Stack.Screen name="TokenDetail" component={TokenDetailScreen} />
              <Stack.Screen name="InsightsDetail" component={InsightsDetailScreen} />
              <Stack.Screen name="Subscription" component={SubscriptionScreen} />
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
