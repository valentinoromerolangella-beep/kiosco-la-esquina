import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../data/products'
import type { CartItem as CartItemType } from '../types'

export default function CartItem({ item }: { item: CartItemType }) {
  const { removeFromCart, updateQuantity } = useCart()
  const { product, quantity } = item
  const subtotal = product.price * quantity

  return (
    <article className="cart-item">
      <div className={`cart-item__media product-card__media--${product.category}`}>
        <span aria-hidden="true">{product.image}</span>
      </div>

      <div className="cart-item__info">
        <h3>
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="cart-item__price">{formatPrice(product.price)} c/u</p>
        <p className="cart-item__stock">
          Stock disponible: {product.stock} unidades
        </p>
      </div>

      <div className="cart-item__quantity">
        <button
          type="button"
          className="qty-btn"
          onClick={() => updateQuantity(product.id, quantity - 1)}
          disabled={quantity <= 1}
          aria-label={`Quitar una unidad de ${product.name}`}
        >
          −
        </button>
        <span className="cart-item__qty" aria-live="polite">
          {quantity}
        </span>
        <button
          type="button"
          className="qty-btn"
          onClick={() => updateQuantity(product.id, quantity + 1)}
          disabled={quantity >= product.stock}
          aria-label={`Agregar una unidad de ${product.name}`}
        >
          +
        </button>
      </div>

      <div className="cart-item__subtotal">
        <span className="cart-item__subtotal-label">Subtotal</span>
        <strong>{formatPrice(subtotal)}</strong>
      </div>

      <button
        type="button"
        className="cart-item__remove"
        onClick={() => removeFromCart(product.id)}
        aria-label={`Eliminar ${product.name} del carrito`}
      >
        🗑️
      </button>
    </article>
  )
}
