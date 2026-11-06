import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CartItem, Product } from '../types'

interface CartContextValue {
  items: CartItem[]
  addToCart: (product: Product, quantity?: number) => boolean
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  notification: string | null
  clearNotification: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

const STORAGE_KEY = 'kiosco-el-rapido-cart'

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.filter(
      (item): item is CartItem =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as CartItem).quantity === 'number' &&
        typeof (item as CartItem).product === 'object' &&
        (item as CartItem).product !== null &&
        typeof (item as CartItem).product.id === 'number',
    )
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart)
  const [notification, setNotification] = useState<string | null>(null)

  const clearNotification = useCallback(() => {
    setNotification(null)
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Si el almacenamiento no está disponible, el carrito sigue funcionando en memoria.
    }
  }, [items])

  useEffect(() => {
    if (!notification) return
    const timer = window.setTimeout(() => setNotification(null), 2800)
    return () => window.clearTimeout(timer)
  }, [notification])

  const addToCart = useCallback(
    (product: Product, quantity = 1): boolean => {
      if (product.stock <= 0) {
        setNotification(`Lo sentimos, "${product.name}" no tiene stock disponible.`)
        return false
      }

      const safeQuantity = Math.max(1, Math.floor(quantity))
      const existing = items.find((item) => item.product.id === product.id)
      const currentQuantity = existing?.quantity ?? 0
      const room = product.stock - currentQuantity

      if (room <= 0) {
        setNotification(
          `Ya tenés en el carrito todo el stock disponible de "${product.name}".`,
        )
        return false
      }

      const quantityToAdd = Math.min(safeQuantity, room)

      setItems((previous) => {
        const alreadyInCart = previous.find((item) => item.product.id === product.id)
        if (alreadyInCart) {
          return previous.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantityToAdd }
              : item,
          )
        }
        return [...previous, { product, quantity: quantityToAdd }]
      })

      if (quantityToAdd < safeQuantity) {
        setNotification(
          `Solo hay ${product.stock} unidades de "${product.name}". Agregamos ${quantityToAdd}.`,
        )
      } else {
        setNotification(
          `¡${quantityToAdd} x ${product.name} agregado al carrito!`,
        )
      }

      return true
    },
    [items],
  )

  const removeFromCart = useCallback((productId: number) => {
    setItems((previous) => previous.filter((item) => item.product.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    setItems((previous) =>
      previous.map((item) => {
        if (item.product.id !== productId) return item
        const maxStock = item.product.stock
        const clamped = Math.min(Math.max(1, Math.floor(quantity)), maxStock)
        return { ...item, quantity: clamped }
      }),
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const totalItems = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  )

  const totalPrice = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0,
      ),
    [items],
  )

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      notification,
      clearNotification,
    }),
    [
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      notification,
      clearNotification,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe utilizarse dentro de un CartProvider.')
  }
  return context
}
