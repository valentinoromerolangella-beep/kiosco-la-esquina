export type Category = 'bebidas' | 'snacks' | 'golosinas' | 'varios'

export interface Product {
  id: number
  name: string
  category: Category
  price: number
  stock: number
  description: string
  image: string
}

export interface CategoryInfo {
  value: Category
  label: string
  emoji: string
  description: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface OrderItemInput {
  product_id: number
  quantity: number
}

export interface OrderItem {
  product_id: number
  product_name: string
  unit_price: number
  quantity: number
  subtotal: number
}

export interface Order {
  id: number
  created_at: string
  total: number
  items: OrderItem[]
}
