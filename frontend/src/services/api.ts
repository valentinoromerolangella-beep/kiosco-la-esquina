import type { Order, Product } from '../types'

const API_URL = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '')

export class ApiError extends Error {
  status: number

  constructor(message: string, status = 0) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })
  } catch {
    throw new ApiError(
      'No se pudo conectar con el servidor. Verificá que el backend esté funcionando.',
    )
  }

  if (!response.ok) {
    let message = `Error del servidor (${response.status}).`

    try {
      const body = await response.json()
      if (typeof body?.detail === 'string') {
        message = body.detail
      } else if (Array.isArray(body?.detail)) {
        message = body.detail
          .map((item: { msg?: string }) => item?.msg)
          .filter(Boolean)
          .join('. ')
      }
    } catch {
      // Se conserva el mensaje genérico si la respuesta no es JSON.
    }

    throw new ApiError(message, response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export function getProducts(): Promise<Product[]> {
  return request<Product[]>('/products')
}

export function getProduct(id: number | string): Promise<Product> {
  return request<Product>(`/products/${id}`)
}

export function createOrder(
  items: { product_id: number; quantity: number }[],
): Promise<Order> {
  return request<Order>('/orders', {
    method: 'POST',
    body: JSON.stringify({ items }),
  })
}

export function getOrders(): Promise<Order[]> {
  return request<Order[]>('/orders')
}
