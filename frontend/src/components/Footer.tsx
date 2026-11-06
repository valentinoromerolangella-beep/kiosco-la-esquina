import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span aria-hidden="true">🛒</span>
          <div>
            <p className="footer__title">Kiosco El Rápido</p>
            <p className="footer__text">
              Tu kiosco de barrio, ahora también online.
            </p>
          </div>
        </div>

        <div className="footer__column">
          <p className="footer__heading">Navegación</p>
          <Link to="/">Inicio</Link>
          <Link to="/products">Productos</Link>
          <Link to="/cart">Carrito</Link>
        </div>

        <div className="footer__column">
          <p className="footer__heading">Horarios</p>
          <span>Lunes a sábado</span>
          <span>8:00 a 22:00 hs</span>
          <span>Domingos: 9:00 a 14:00 hs</span>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} Kiosco El Rápido. Todos los derechos reservados.</span>
        <span>Hecho con ❤️ en Argentina</span>
      </div>
    </footer>
  )
}
