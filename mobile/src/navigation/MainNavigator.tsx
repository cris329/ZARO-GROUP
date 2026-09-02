import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Text } from 'react-native'
import { DashboardScreen } from '@/screens/DashboardScreen'
import { ProductsScreen } from '@/screens/ProductsScreen'
import { ReportsScreen } from '@/screens/ReportsScreen'
import { SettingsScreen } from '@/screens/SettingsScreen'
import { ProductsNavigator } from './ProductsNavigator'
import { OrdersNavigator } from './OrdersNavigator'
import theme from '@/theme'

const Tab = createBottomTabNavigator()

const icons: Record<string, string> = {
  Dashboard: '🏠',
  Productos: '🌾',
  Pedidos: '📋',
  Reportes: '📊',
  Ajustes: '⚙️',
}

function TabIcon({ route, focused }: { route: string; focused: boolean }) {
  return (
    <Text
      style={{
        fontSize: 20,
        opacity: focused ? 1 : 0.5,
        color: focused ? theme.colors.primary : undefined,
      }}
    >
      {icons[route] ?? '•'}
    </Text>
  )
}

export function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: '#fff',
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarIcon: ({ focused }) => <TabIcon route={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Productos" component={ProductsNavigator} />
      <Tab.Screen name="Pedidos" component={OrdersNavigator} />
      <Tab.Screen name="Reportes" component={ReportsScreen} />
      <Tab.Screen name="Ajustes" component={SettingsScreen} />
    </Tab.Navigator>
  )
}