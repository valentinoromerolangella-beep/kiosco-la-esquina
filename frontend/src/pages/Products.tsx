import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { CATEGORIES } from '../data/products'
import { getProducts } from '../services/api'
import type { Product } from '../types'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const categoryParam = searchParams.get('category')
  const searchTerm = searchParams.get('search') ?? ''

  const activeCategory = CATEGORIES.some(
    (category) => category.value === categoryParam,
  )
    ? categoryParam
    : null

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)

    getProducts()
      .then((data) => {
        if (active) setProducts(data)
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : 'No se pudieron cargar los productos.',
          )
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [reloadKey])

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    return products.filter((product) => {
      const matchesCategory = activeCategory
        ? product.category === activeCategory
        : true
      const matchesSearch = term
        ? product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term)
        : true
      return matchesCategory && matchesSearch
    })
  }, [products, activeCategory, searchTerm])

  const updateCategory = (category: string | null) => {
    const next = new URLSearchParams(searchParams)
    if (category) {
      next.set('category', category)
    } else {
      next.delete('category')
    }
    setSearchParams(next)
  }

  const updateSearch = (value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value) {
      next.set('search', value)
    } else {
      next.delete('search')
    }
    setSearchParams(next, { replace: true })
  }

  const clearFilters = () => {
    setSearchParams({})
  }

  return (
    <div className="page">
      <div className="page__header">
        <div className="container">
          <p className="section__eyebrow">Catálogo</p>
          <h1>Nuestros productos</h1>
          <p className="page__subtitle">
            Elegí por categoría o buscá por nombre. El stock se actualiza después
            de cada pedido.
          </p>
        </div>
      </div>

      <div className="container page__content">
        <div className="filters">
          <div className="filters__chips" role="group" aria-label="Filtrar por categoría">
            <button
              type="button"
              className={`chip ${!activeCategory ? 'chip--active' : ''}`}
              onClick={() => updateCategory(null)}
              aria-pressed={!activeCategory}
            >
              🧺 Todos
            </button>
            {CATEGORIES.map((category) => (
              <button
                key={category.value}
                type="button"
                className={`chip ${
                  activeCategory === category.value ? 'chip--active' : ''
                }`}
                onClick={() => updateCategory(category.value)}
                aria-pressed={activeCategory === category.value}
              >
                {category.emoji} {category.label}
              </button>
            ))}
          </div>

          <div className="filters__search">
            <label htmlFor="product-search" className="sr-only">
              Buscar productos
            </label>
            <span aria-hidden="true">🔍</span>
            <input
              id="product-search"
              type="search"
              placeholder="Buscar por nombre o descripción..."
              value={searchTerm}
              onChange={(event) => updateSearch(event.target.value)}
            />
          </div>
        </div>

        {loading && (
          <div className="state-message">
            <span className="spinner" aria-hidden="true" />
            Cargando catálogo...
          </div>
        )}

        {error && !loading && (
          <div className="alert alert--error" role="alert">
            <p>{error}</p>
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={() => setReloadKey((key) => key + 1)}
            >
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <p className="results-count">
              {filteredProducts.length}{' '}
              {filteredProducts.length === 1
                ? 'producto encontrado'
                : 'productos encontrados'}
              {activeCategory && (
                <>
                  {' '}en{' '}
                  <strong>
                    {CATEGORIES.find((c) => c.value === activeCategory)?.label}
                  </strong>
                </>
              )}
            </p>

            {filteredProducts.length === 0 ? (
              <div className="empty-state">
                <span aria-hidden="true">🔎</span>
                <h2>No encontramos productos</h2>
                <p>Probá con otra búsqueda o quitá los filtros aplicados.</p>
                <button type="button" className="btn btn--primary" onClick={clearFilters}>
                  Ver todos los productos
                </button>
              </div>
            ) : (
              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
