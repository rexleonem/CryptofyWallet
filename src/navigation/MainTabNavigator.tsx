import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabBarIcon } from '../components/icons';
import { COLORS } from '../constants/Theme';

import ChatScreen from '../screens/AI/ChatScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import PortfolioHomeScreen from '../screens/Portfolio/PortfolioHomeScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import HistoryScreen from '../screens/Transactions/HistoryScreen';

const Tab = createBottomTabNavigator();
const TabNavigator = Tab.Navigator as React.ComponentType<any>;
const TabScreen = Tab.Screen as React.ComponentType<any>;

export default function MainTabNavigator() {
  const insets = useSafeAreaInsets();
  const bottomOffset = Math.max(insets.bottom, 12);

  const screenOptions = {
    headerShown: false,
    tabBarShowLabel: true,
    tabBarHideOnKeyboard: true,
    tabBarActiveTintColor: COLORS.primary,
    tabBarInactiveTintColor: 'rgba(255,255,255,0.45)',
    tabBarStyle: [
      styles.tabBar,
      {
        height: 70,
        bottom: bottomOffset,
      },
    ],
    tabBarItemStyle: styles.tabBarItem,
    tabBarLabelStyle: styles.tabBarLabel,
  };

  const tabIcon = (name: React.ComponentProps<typeof TabBarIcon>['name'], isPrimary = false) =>
    ({ focused }: { focused: boolean }) => <TabBarIcon name={name} focused={focused} isPrimary={isPrimary} />;

  return (
    <TabNavigator screenOptions={screenOptions}>
      <TabScreen
        name="Home"
        component={DashboardScreen}
        options={{ tabBarIcon: tabIcon('dashboard') }}
      />
      <TabScreen
        name="Portfolio"
        component={PortfolioHomeScreen}
        options={{ tabBarIcon: tabIcon('analytics') }}
      />
      <TabScreen
        name="AI"
        component={ChatScreen}
        options={{
          tabBarLabel: 'AI',
          tabBarIcon: tabIcon('ai', true),
        }}
      />
      <TabScreen
        name="Activity"
        component={HistoryScreen}
        options={{
          tabBarIcon: tabIcon('transfer'),
        }}
      />
      <TabScreen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: tabIcon('profile'),
        }}
      />
    </TabNavigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 18,
    right: 18,
    borderRadius: 28,
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(10,16,30,0.88)',
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: 'rgba(165,216,255,0.12)',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: Platform.OS === 'android' ? 18 : 0,
  },
  tabBarItem: {
    height: 54,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 0,
    letterSpacing: 0,
  },
});
