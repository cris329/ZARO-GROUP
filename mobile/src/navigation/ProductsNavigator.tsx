import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ProductsScreen } from '@/screens/ProductsScreen'
import { ProductDetailScreen } from '@/screens/ProductDetailScreen'
import { CreateProductScreen } from '@/screens/CreateProductScreen'

const Stack = createNativeStackNavigator()

export function ProductsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#16a34a' },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen
        name="ProductsList"
        component={ProductsScreen}
        options={{ title: 'Productos' }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Detalle' }}
      />
      <Stack.Screen
        name="CreateProduct"
        component={CreateProductScreen}
        options={{ title: 'Nuevo producto' }}
      />
    </Stack.Navigator>
  )
}