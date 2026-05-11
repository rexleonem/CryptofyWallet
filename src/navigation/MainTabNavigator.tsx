import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Wallet, PieChart, Repeat, MessageSquare, Settings as SettingsIcon } from 'lucide-react-native';
import { COLORS } from '../constants/Theme';

// Screens
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import PortfolioHomeScreen from '../screens/Portfolio/PortfolioHomeScreen';
import P2PMarketplace from '../screens/P2P/P2PMarketplace';
import ChatScreen from '../screens/AI/ChatScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.border,
          height: 70,
          paddingBottom: 12,
          paddingTop: 12,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen 
        name="Wallet" 
        component={DashboardScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Wallet size={size} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Portfolio" 
        component={PortfolioHomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <PieChart size={size} color={color} />,
        }}
      />
      <Tab.Screen 
        name="P2P" 
        component={P2PMarketplace} 
        options={{
          tabBarIcon: ({ color, size }) => <Repeat size={size} color={color} />,
        }}
      />
      <Tab.Screen 
        name="AI" 
        component={ChatScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <SettingsIcon size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
