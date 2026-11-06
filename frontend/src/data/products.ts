import type { CategoryInfo, Product } from '../types'

export const CATEGORIES: CategoryInfo[] = [
  {
    value: 'bebidas',
    label: 'Bebidas',
    emoji: '🥤',
    description: 'Gaseosas, aguas, jugos e isotónicas bien frías.',
  },
  {
    value: 'snacks',
    label: 'Snacks',
    emoji: '🍟',
    description: 'Papas, galletitas y maní para picar en cualquier momento.',
  },
  {
    value: 'golosinas',
    label: 'Golosinas',
    emoji: '🍫',
    description: 'Chocolates, alfajores y chicles para endulzar el día.',
  },
  {
    value: 'varios',
    label: 'Varios',
    emoji: '🛍️',
    description: 'Yerba, infusiones y esos productos que siempre hacen falta.',
  },
]

export const CATEGORY_EMOJI: Record<string, string> = {
  bebidas: '🥤',
  snacks: '🍟',
  golosinas: '🍫',
  varios: '🛍️',
}

export const formatPrice = (price: number): string =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price)

// Datos de referencia que se utilizan para sembrar la base de datos del backend.
// El catálogo de la aplicación siempre se obtiene desde la API.
export const fallbackProducts: Product[] = [
  {
    id: 1,
    name: 'Coca-Cola 500ml',
    category: 'bebidas',
    price: 1800,
    stock: 24,
    description:
      'Gaseosa Coca-Cola en botella de 500ml. Ideal para acompañar tus comidas bien fría.',
    image: '🥤',
  },
  {
    id: 2,
    name: 'Agua mineral 500ml',
    category: 'bebidas',
    price: 1200,
    stock: 30,
    description:
      'Agua mineral sin gas de 500ml. La opción más refrescante para hidratarte.',
    image: '💧',
  },
  {
    id: 3,
    name: 'Papas Lays clásicas',
    category: 'snacks',
    price: 2500,
    stock: 18,
    description:
      'Papas fritas de corte clásico con sal. Crujientes y perfectas para compartir.',
    image: '🍟',
  },
  {
    id: 4,
    name: 'Alfajor Jorgito',
    category: 'golosinas',
    price: 1500,
    stock: 40,
    description:
      'Alfajor de chocolate relleno con dulce de leche. Un clásico argentino imposible de resistir.',
    image: '🍫',
  },
  {
    id: 5,
    name: 'Chicles Beldent',
    category: 'golosinas',
    price: 1100,
    stock: 35,
    description:
      'Chicles sabor menta en formato práctico. Aliento fresco en cualquier momento del día.',
    image: '🍬',
  },
  {
    id: 6,
    name: 'Galletitas Oreo',
    category: 'snacks',
    price: 1600,
    stock: 22,
    description:
      'Galletitas de chocolate rellenas de crema. El balance perfecto entre dulce y crocante.',
    image: '🍪',
  },
  {
    id: 7,
    name: 'Gatorade 500ml',
    category: 'bebidas',
    price: 2100,
    stock: 20,
    description:
      'Bebida isotónica sabor frutas tropicales de 500ml. Rehidrata y repone sales.',
    image: '🧃',
  },
  {
    id: 8,
    name: 'Maní salado',
    category: 'snacks',
    price: 1400,
    stock: 25,
    description:
      'Maní tostado con sal en paquete de 100g. El snack ideal para la picada del finde.',
    image: '🥜',
  },
  {
    id: 9,
    name: 'Chocolate Milka',
    category: 'golosinas',
    price: 2800,
    stock: 16,
    description:
      'Chocolate con leche con relleno de avellanas. Suavidad que se derrite en la boca.',
    image: '🍫',
  },
  {
    id: 10,
    name: 'Yerba mate',
    category: 'varios',
    price: 3500,
    stock: 12,
    description:
      'Yerba mate elaborada de 1kg. El compañero indispensable de todas las mañanas.',
    image: '🧉',
  },
]
