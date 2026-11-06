import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container page__content">
      <div className="empty-state">
        <span className="empty-state__code">404</span>
        <h1>Página no encontrada</h1>
        <p>
          La página que buscás no existe o cambió de lugar. Volvé al inicio o
          explorá el catálogo.
        </p>
        <div className="empty-state__actions">
          <Link to="/" className="btn btn--primary btn--lg">
            Ir al inicio
          </Link>
          <Link to="/products" className="btn btn--outline btn--lg">
            Ver productos
          </Link>
        </div>
      </div>
    </div>
  )
}
