import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { CATEGORIES } from '../data/products'
import { getProducts } from '../services/api'
import type { Product } from '../types'

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    getProducts()
      .then((products) => {
        if (active) setFeatured(products.slice(0, 4))
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : 'No se pudieron cargar los productos destacados.',
          )
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="home">
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__content">
            <span className="hero__badge">⏱️ Abierto todos los días</span>
            <h1>
              Todo lo que necesitás,
              <span className="hero__highlight"> al toque.</span>
            </h1>
            <p className="hero__text">
              Bienvenido a <strong>Kiosco La Esquina</strong>. Bebidas bien frías,
              snacks, golosinas y productos de todos los días. Elegí desde tu casa
              y retirá tu pedido en el mostrador.
            </p>
            <div className="hero__actions">
              <Link to="/products" className="btn btn--yellow btn--lg">
                Ver productos
              </Link>
              <Link to="/products?category=bebidas" className="btn btn--ghost btn--lg">
                🥤 Bebidas frías
              </Link>
            </div>
            <ul className="hero__perks">
              <li>✅ Pedido online</li>
              <li>✅ Stock actualizado</li>
              <li>✅ Atención de barrio</li>
            </ul>
          </div>

          <div className="hero__card" aria-hidden="true">
            <div className="hero__card-top">
              <span className="hero__card-dot" />
              <span className="hero__card-dot" />
              <span className="hero__card-dot" />
            </div>
            <p className="hero__card-title">Pedido de ejemplo</p>
            <ul className="hero__receipt">
              <li>
                <span>🥤 Coca-Cola 500ml</span>
                <span>$1.800</span>
              </li>
              <li>
                <span>🍟 Papas Lays</span>
                <span>$2.500</span>
              </li>
              <li>
                <span>🍫 Alfajor Jorgito</span>
                <span>$1.500</span>
              </li>
            </ul>
            <div className="hero__receipt-total">
              <span>Total</span>
              <span>$5.800</span>
            </div>
            <span className="hero__stamp">¡Listo para retirar!</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__header">
            <div>
              <p className="section__eyebrow">Categorías</p>
              <h2>¿Qué estás buscando?</h2>
            </div>
            <Link to="/products" className="link-arrow">
              Ver todo el catálogo →
            </Link>
          </div>

          <div className="category-grid">
            {CATEGORIES.map((category) => (
              <Link
                key={category.value}
                to={`/products?category=${category.value}`}
                className="category-card"
              >
                <span className="category-card__emoji" aria-hidden="true">
                  {category.emoji}
                </span>
                <h3>{category.label}</h3>
                <p>{category.description}</p>
                <span className="category-card__cta">Explorar →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tinted">
        <div className="container">
          <div className="section__header">
            <div>
              <p className="section__eyebrow">Lo más pedido</p>
              <h2>Destacados del kiosco</h2>
            </div>
            <Link to="/products" className="link-arrow">
              Ver todos →
            </Link>
          </div>

          {loading && (
            <div className="state-message">
              <span className="spinner" aria-hidden="true" />
              Cargando productos...
            </div>
          )}

          {error && !loading && (
            <div className="alert alert--error" role="alert">
              {error}
            </div>
          )}

          {!loading && !error && featured.length > 0 && (
            <div className="product-grid">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="steps">
            <div className="steps__intro">
              <p className="section__eyebrow">Así de fácil</p>
              <h2>Pedí en tres pasos</h2>
              <p>
                Sin filas ni esperas. Armá tu pedido, confirmalo y pasá a retirarlo
                por el kiosco.
              </p>
            </div>
            <ol className="steps__list">
              <li>
                <span className="steps__number">1</span>
                <div>
                  <h3>Elegí tus productos</h3>
                  <p>Recorré el catálogo y filtrá por categoría.</p>
                </div>
              </li>
              <li>
                <span className="steps__number">2</span>
                <div>
                  <h3>Armá el carrito</h3>
                  <p>Ajustá cantidades y revisá el total.</p>
                </div>
              </li>
              <li>
                <span className="steps__number">3</span>
                <div>
                  <h3>Confirmá el pedido</h3>
                  <p>Te damos tu número de pedido al instante.</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>
    </div>
  )
}
