"""Esquema de la base SQLite y datos iniciales del catálogo."""

CREATE_TABLES_SQL = """
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (
        category IN ('bebidas', 'snacks', 'golosinas', 'varios')
    ),
    price REAL NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL CHECK (stock >= 0),
    description TEXT NOT NULL,
    image TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL,
    total REAL NOT NULL CHECK (total >= 0)
);

CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    unit_price REAL NOT NULL CHECK (unit_price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    subtotal REAL NOT NULL CHECK (subtotal >= 0),
    FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products (id)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id
    ON order_items (order_id);
"""

INSERT_PRODUCT_SQL = """
INSERT INTO products (id, name, category, price, stock, description, image)
VALUES (?, ?, ?, ?, ?, ?, ?);
"""

# Los precios están expresados en pesos argentinos (ARS).
SEED_PRODUCTS: list[tuple[int, str, str, float, int, str, str]] = [
    (
        1,
        "Coca-Cola 500ml",
        "bebidas",
        1800.0,
        24,
        "Gaseosa Coca-Cola en botella de 500ml. Ideal para acompañar tus comidas bien fría.",
        "🥤",
    ),
    (
        2,
        "Agua mineral 500ml",
        "bebidas",
        1200.0,
        30,
        "Agua mineral sin gas de 500ml. La opción más refrescante para hidratarte.",
        "💧",
    ),
    (
        3,
        "Papas Lays clásicas",
        "snacks",
        2500.0,
        18,
        "Papas fritas de corte clásico con sal. Crujientes y perfectas para compartir.",
        "🍟",
    ),
    (
        4,
        "Alfajor Jorgito",
        "golosinas",
        1500.0,
        40,
        "Alfajor de chocolate relleno con dulce de leche. Un clásico argentino imposible de resistir.",
        "🍫",
    ),
    (
        5,
        "Chicles Beldent",
        "golosinas",
        1100.0,
        35,
        "Chicles sabor menta en formato práctico. Aliento fresco en cualquier momento del día.",
        "🍬",
    ),
    (
        6,
        "Galletitas Oreo",
        "snacks",
        1600.0,
        22,
        "Galletitas de chocolate rellenas de crema. El balance perfecto entre dulce y crocante.",
        "🍪",
    ),
    (
        7,
        "Gatorade 500ml",
        "bebidas",
        2100.0,
        20,
        "Bebida isotónica sabor frutas tropicales de 500ml. Rehidrata y repone sales.",
        "🧃",
    ),
    (
        8,
        "Maní salado",
        "snacks",
        1400.0,
        25,
        "Maní tostado con sal en paquete de 100g. El snack ideal para la picada del finde.",
        "🥜",
    ),
    (
        9,
        "Chocolate Milka",
        "golosinas",
        2800.0,
        16,
        "Chocolate con leche con relleno de avellanas. Suavidad que se derrite en la boca.",
        "🍫",
    ),
    (
        10,
        "Yerba mate",
        "varios",
        3500.0,
        12,
        "Yerba mate elaborada de 1kg. El compañero indispensable de todas las mañanas.",
        "🧉",
    ),
]
