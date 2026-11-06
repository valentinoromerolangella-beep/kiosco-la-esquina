import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { CATEGORIES, formatPrice } from '../data/products'
import type { Product } from '../types'

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const category = CATEGORIES.find((item) => item.value === product.category)
  const outOfStock = product.stock <= 0

  return (
    <article className="product-card">
      <div className={`product-card__media product-card__media--${product.category}`}>
        <span className="product-card__emoji" aria-hidden="true">
          {product.image}
        </span>
        <span className="product-card__category">
          {category?.emoji} {category?.label ?? product.category}
        </span>
      </div>

      <div className="product-card__body">
        <h3 className="product-card__name">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>

        <p className="product-card__description">{product.description}</p>

        <div className="product-card__meta">
          <span className="product-card__price">{formatPrice(product.price)}</span>
          <span className={`stock-pill ${outOfStock ? 'stock-pill--empty' : ''}`}>
            {outOfStock ? 'Sin stock' : `${product.stock} disponibles`}
          </span>
        </div>

        <div className="product-card__actions">
          <Link to={`/products/${product.id}`} className="btn btn--outline btn--sm">
            Ver detalle
          </Link>
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => addToCart(product, 1)}
            disabled={outOfStock}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </article>
  )
}
