import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/products', label: 'Productos' },
  { to: '/cart', label: 'Carrito' },
]

export default function Header() {
  const { totalItems } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="brand" aria-label="Kiosco La Esquina - Inicio">
          <span className="brand__logo" aria-hidden="true">
            🛒
          </span>
          <span className="brand__text">
            Kiosco <strong>La Esquina</strong>
          </span>
        </Link>

        <button
          type="button"
          className="header__toggle"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <nav
          id="main-nav"
          className={`nav ${menuOpen ? 'nav--open' : ''}`}
          aria-label="Navegación principal"
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                isActive ? 'nav__link nav__link--active' : 'nav__link'
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
              {link.to === '/cart' && totalItems > 0 && (
                <span className="nav__badge" aria-label={`${totalItems} productos`}>
                  {totalItems}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
