import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { CATEGORIES, formatPrice } from '../data/products'
import { ApiError, getProduct } from '../services/api'
import type { Product } from '../types'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { addToCart } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    setNotFound(false)
    setProduct(null)
    setQuantity(1)

    if (!id) {
      setNotFound(true)
      setLoading(false)
      return
    }

    getProduct(id)
      .then((data) => {
        if (active) setProduct(data)
      })
      .catch((err: unknown) => {
        if (!active) return
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true)
        } else {
          setError(
            err instanceof Error
              ? err.message
              : 'No se pudo cargar el producto.',
          )
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id, reloadKey])

  if (loading) {
    return (
      <div className="container page__content">
        <div className="state-message">
          <span className="spinner" aria-hidden="true" />
          Cargando producto...
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="container page__content">
        <div className="empty-state">
          <span aria-hidden="true">🔍</span>
          <h1>Producto no encontrado</h1>
          <p>El producto que buscás no existe o ya no está disponible.</p>
          <Link to="/products" className="btn btn--primary">
            Volver al catálogo
          </Link>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container page__content">
        <div className="alert alert--error" role="alert">
          <p>{error ?? 'No se pudo cargar el producto.'}</p>
          <button
            type="button"
            className="btn btn--outline btn--sm"
            onClick={() => setReloadKey((key) => key + 1)}
          >
            Reintentar
          </button>
        </div>
        <Link to="/products" className="link-arrow">
          ← Volver al catálogo
        </Link>
      </div>
    )
  }

  const category = CATEGORIES.find((item) => item.value === product.category)
  const outOfStock = product.stock <= 0
  const maxQuantity = Math.max(1, product.stock)
  const subtotal = product.price * quantity

  const decrease = () => setQuantity((current) => Math.max(1, current - 1))
  const increase = () =>
    setQuantity((current) => Math.min(product.stock, current + 1))

  const handleQuantityChange = (value: string) => {
    const parsed = Number.parseInt(value, 10)
    if (Number.isNaN(parsed)) {
      setQuantity(1)
      return
    }
    setQuantity(Math.min(Math.max(1, parsed), maxQuantity))
  }

  return (
    <div className="container page__content">
      <nav className="breadcrumb" aria-label="Migas de pan">
        <Link to="/">Inicio</Link>
        <span aria-hidden="true">/</span>
        <Link to="/products">Productos</Link>
        <span aria-hidden="true">/</span>
        <span>{product.name}</span>
      </nav>

      <article className="product-detail">
        <div className={`product-detail__media product-card__media--${product.category}`}>
          <span aria-hidden="true">{product.image}</span>
          <span className="product-detail__category-tag">
            {category?.emoji} {category?.label ?? product.category}
          </span>
        </div>

        <div className="product-detail__info">
          <h1>{product.name}</h1>

          <div className="product-detail__badges">
            <span className={`stock-pill ${outOfStock ? 'stock-pill--empty' : ''}`}>
              {outOfStock ? 'Sin stock' : `Stock: ${product.stock} unidades`}
            </span>
            {!outOfStock && product.stock <= 5 && (
              <span className="stock-pill stock-pill--low">¡Últimas unidades!</span>
            )}
          </div>

          <p className="product-detail__description">{product.description}</p>

          <p className="product-detail__price">{formatPrice(product.price)}</p>

          <div className="product-detail__purchase">
            <div className="quantity-picker">
              <span className="quantity-picker__label">Cantidad</span>
              <div className="quantity-picker__controls">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={decrease}
                  disabled={quantity <= 1 || outOfStock}
                  aria-label="Disminuir cantidad"
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  max={maxQuantity}
                  value={quantity}
                  onChange={(event) => handleQuantityChange(event.target.value)}
                  disabled={outOfStock}
                  aria-label="Cantidad a agregar"
                />
                <button
                  type="button"
                  className="qty-btn"
                  onClick={increase}
                  disabled={quantity >= product.stock || outOfStock}
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>
            </div>

            {!outOfStock && (
              <p className="product-detail__subtotal">
                Subtotal: <strong>{formatPrice(subtotal)}</strong>
              </p>
            )}

            <button
              type="button"
              className="btn btn--primary btn--lg"
              onClick={() => addToCart(product, quantity)}
              disabled={outOfStock}
            >
              {outOfStock ? 'Producto sin stock' : '🛒 Agregar al carrito'}
            </button>

            <Link to="/products" className="btn btn--outline btn--lg">
              ← Volver al catálogo
            </Link>
          </div>

          <ul className="product-detail__perks">
            <li>🏪 Retiro en el local</li>
            <li>💵 Pago en efectivo o transferencia</li>
            <li>📦 Reservamos tu pedido</li>
          </ul>
        </div>
      </article>
    </div>
  )
}
