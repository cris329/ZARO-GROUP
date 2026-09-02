export type RootStackParamList = {
  Login: undefined
  Register: undefined
}

export type MainTabParamList = {
  Dashboard: undefined
  Productos: undefined
  Pedidos: undefined
  Reportes: undefined
  Ajustes: undefined
}

export type ProductsStackParamList = {
  ProductsList: undefined
  ProductDetail: { id: string }
  CreateProduct: undefined
}

export type OrdersStackParamList = {
  OrdersList: undefined
  OrderDetail: { id: string }
  CreateOrder: undefined
}