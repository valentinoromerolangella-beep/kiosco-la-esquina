import { useState } from 'react'
import { Link } from 'react-router-dom'
import CartItem from '../components/CartItem'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../data/products'
import { createOrder } from '../services/api'
import type { Order } from '../types'

export default function Cart() {
  const { items, totalItems, totalPrice, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null)

  const handleCheckout = async () => {
    if (items.length === 0 || isSubmitting) return

    setIsSubmitting(true)
    setError(null)

    try {
      const order = await createOrder(
        items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      )
      setCompletedOrder(order)
      clearCart()
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo registrar el pedido. Intentá nuevamente.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClearCart = () => {
    if (window.confirm('¿Seguro que querés vaciar el carrito?')) {
      clearCart()
      setError(null)
    }
  }

  if (completedOrder) {
    return (
      <div className="container page__content">
        <div className="order-success">
          <span className="order-success__icon" aria-hidden="true">
            ✅
          </span>
          <p className="section__eyebrow">¡Pedido confirmado!</p>
          <h1>Gracias por tu compra</h1>
          <p className="order-success__text">
            Tu pedido <strong>#{String(completedOrder.id).padStart(4, '0')}</strong>{' '}
            fue registrado correctamente. Podés pasar a retirarlo por el kiosco.
          </p>

          <div className="order-success__summary">
            <div>
              <span>Número de pedido</span>
              <strong>#{String(completedOrder.id).padStart(4, '0')}</strong>
            </div>
            <div>
              <span>Fecha</span>
              <strong>
                {new Date(completedOrder.created_at).toLocaleString('es-AR', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}
              </strong>
            </div>
            <div>
              <span>Total abonado</span>
              <strong>{formatPrice(completedOrder.total)}</strong>
            </div>
          </div>

          <ul className="order-success__items">
            {completedOrder.items.map((item) => (
              <li key={`${item.product_id}-${item.product_name}`}>
                <span>
                  {item.quantity} x {item.product_name}
                </span>
                <span>{formatPrice(item.subtotal)}</span>
              </li>
            ))}
          </ul>

          <div className="order-success__actions">
            <Link to="/products" className="btn btn--primary btn--lg">
              Seguir comprando
            </Link>
            <Link to="/" className="btn btn--outline btn--lg">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page__header">
        <div className="container">
          <p className="section__eyebrow">Tu compra</p>
          <h1>Carrito</h1>
          <p className="page__subtitle">
            Revisá los productos, ajustá cantidades y confirmá tu pedido.
          </p>
        </div>
      </div>

      <div className="container page__content">
        {items.length === 0 ? (
          <div className="empty-state">
            <span aria-hidden="true">🛒</span>
            <h2>Tu carrito está vacío</h2>
            <p>Agregá productos del catálogo para empezar tu pedido.</p>
            <Link to="/products" className="btn btn--primary btn--lg">
              Ver productos
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-list">
              <div className="cart-list__header">
                <h2>
                  {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
                </h2>
                <button
                  type="button"
                  className="btn btn--danger-ghost btn--sm"
                  onClick={handleClearCart}
                  disabled={isSubmitting}
                >
                  Vaciar carrito
                </button>
              </div>

              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>

            <aside className="cart-summary">
              <h2>Resumen del pedido</h2>

              <div className="cart-summary__row">
                <span>Productos</span>
                <span>{totalItems}</span>
              </div>
              <div className="cart-summary__row">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="cart-summary__row">
                <span>Envío</span>
                <span>Retiro en el local</span>
              </div>

              <div className="cart-summary__total">
                <span>Total</span>
                <strong>{formatPrice(totalPrice)}</strong>
              </div>

              {error && (
                <div className="alert alert--error" role="alert">
                  {error}
                </div>
              )}

              <button
                type="button"
                className="btn btn--primary btn--lg btn--block"
                onClick={handleCheckout}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner spinner--small" aria-hidden="true" />
                    Procesando pedido...
                  </>
                ) : (
                  'Finalizar pedido'
                )}
              </button>

              <Link to="/products" className="cart-summary__continue">
                ← Seguir comprando
              </Link>

              <p className="cart-summary__note">
                El total y el stock se validan en el servidor al confirmar el pedido.
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}
