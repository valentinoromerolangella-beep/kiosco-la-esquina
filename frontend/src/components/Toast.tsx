import { useCart } from '../context/CartContext'

export default function Toast() {
  const { notification } = useCart()

  if (!notification) return null

  return (
    <div className="toast" role="status" aria-live="polite">
      <span className="toast__icon" aria-hidden="true">
        ✓
      </span>
      <span>{notification}</span>
    </div>
  )
}
