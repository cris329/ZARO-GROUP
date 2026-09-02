import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { OrdersScreen } from '@/screens/OrdersScreen'
import { OrderDetailScreen } from '@/screens/OrderDetailScreen'
import { CreateOrderScreen } from '@/screens/CreateOrderScreen'

const Stack = createNativeStackNavigator()

export function OrdersNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#16a34a' },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen name="OrdersList" component={OrdersScreen} options={{ title: 'Pedidos' }} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ title: 'Detalle' }} />
      <Stack.Screen name="CreateOrder" component={CreateOrderScreen} options={{ title: 'Nuevo pedido' }} />
    </Stack.Navigator>
  )
}