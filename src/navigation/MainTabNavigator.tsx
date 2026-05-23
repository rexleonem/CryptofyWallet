import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS } from '../constants/Theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TextIcon from '../components/TextIcon';

// Screens
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import PortfolioHomeScreen from '../screens/Portfolio/PortfolioHomeScreen';
import P2PMarketplace from '../screens/P2P/P2PMarketplace';
import ChatScreen from '../screens/AI/ChatScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';

const Tab = createBottomTabNavigator();
const TabNavigator = Tab.Navigator as React.ComponentType<any>;
const TabScreen = Tab.Screen as React.ComponentType<any>;

export default function MainTabNavigator() {
  const insets = useSafeAreaInsets();
  const screenOptions = {
    headerShown: false,
    tabBarStyle: {
      backgroundColor: COLORS.background,
      borderTopColor: COLORS.border,
      height: 70 + insets.bottom,
      paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
      paddingTop: 12,
    },
    tabBarActiveTintColor: COLORS.primary,
    tabBarInactiveTintColor: COLORS.textMuted,
    tabBarLabelStyle: {
      fontSize: 11,
      fontWeight: '600' as const,
    },
  };
  const tabIcon = (label: string) => ({ color, size }: { color: string; size: number }) =>
    React.createElement(TextIcon, { label, color, size: Math.max(16, size - 2) });
  
  return React.createElement(
    TabNavigator,
    { screenOptions },
    React.createElement(TabScreen, {
      name: 'Home',
      component: DashboardScreen,
      options: {
        tabBarIcon: tabIcon('B'),
      },
    }),
    React.createElement(TabScreen, {
      name: 'Portfolio',
      component: PortfolioHomeScreen,
      options: {
        tabBarIcon: tabIcon('%'),
      },
    }),
    React.createElement(TabScreen, {
      name: 'P2P',
      component: P2PMarketplace,
      options: {
        tabBarIcon: tabIcon('P'),
      },
    }),
    React.createElement(TabScreen, {
      name: 'AI',
      component: ChatScreen,
      options: {
        tabBarIcon: tabIcon('AI'),
      },
    }),
    React.createElement(TabScreen, {
      name: 'Settings',
      component: SettingsScreen,
      options: {
        tabBarIcon: tabIcon('*'),
      },
    }),
  );
}
