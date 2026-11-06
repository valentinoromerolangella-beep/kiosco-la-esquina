from __future__ import annotations

import sqlite3
from datetime import datetime, timezone

from database import get_connection
from schemas import OrderCreate, OrderItemOut, OrderOut, ProductOut


class ProductNotFoundError(Exception):
    def __init__(self, product_id: int) -> None:
        self.product_id = product_id
        super().__init__(f"El producto con id {product_id} no existe.")


class InsufficientStockError(Exception):
    def __init__(self, name: str, available: int, requested: int) -> None:
        self.name = name
        self.available = available
        self.requested = requested
        super().__init__(
            f'Stock insuficiente para "{name}": disponible {available}, solicitado {requested}.'
        )


def _row_to_product(row: sqlite3.Row) -> ProductOut:
    return ProductOut(
        id=row["id"],
        name=row["name"],
        category=row["category"],
        price=row["price"],
        stock=row["stock"],
        description=row["description"],
        image=row["image"],
    )


def list_products() -> list[ProductOut]:
    connection = get_connection()
    try:
        rows = connection.execute(
            "SELECT * FROM products ORDER BY id ASC"
        ).fetchall()
        return [_row_to_product(row) for row in rows]
    finally:
        connection.close()


def get_product(product_id: int) -> ProductOut | None:
    connection = get_connection()
    try:
        row = connection.execute(
            "SELECT * FROM products WHERE id = ?", (product_id,)
        ).fetchone()
        return _row_to_product(row) if row else None
    finally:
        connection.close()


def create_order(payload: OrderCreate) -> OrderOut:
    connection = get_connection()
    try:
        connection.execute("BEGIN IMMEDIATE")

        items: list[OrderItemOut] = []
        total = 0.0

        for requested_item in payload.items:
            row = connection.execute(
                "SELECT * FROM products WHERE id = ?",
                (requested_item.product_id,),
            ).fetchone()

            if row is None:
                raise ProductNotFoundError(requested_item.product_id)

            if row["stock"] < requested_item.quantity:
                raise InsufficientStockError(
                    row["name"], row["stock"], requested_item.quantity
                )

            unit_price = float(row["price"])
            subtotal = round(unit_price * requested_item.quantity, 2)
            total += subtotal

            items.append(
                OrderItemOut(
                    product_id=row["id"],
                    product_name=row["name"],
                    unit_price=unit_price,
                    quantity=requested_item.quantity,
                    subtotal=subtotal,
                )
            )

        total = round(total, 2)
        created_at = datetime.now(timezone.utc)

        cursor = connection.execute(
            "INSERT INTO orders (created_at, total) VALUES (?, ?)",
            (created_at.isoformat(timespec="seconds"), total),
        )
        order_id = int(cursor.lastrowid)

        for item in items:
            connection.execute(
                """
                INSERT INTO order_items
                    (order_id, product_id, product_name, unit_price, quantity, subtotal)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    order_id,
                    item.product_id,
                    item.product_name,
                    item.unit_price,
                    item.quantity,
                    item.subtotal,
                ),
            )
            connection.execute(
                "UPDATE products SET stock = stock - ? WHERE id = ?",
                (item.quantity, item.product_id),
            )

        connection.commit()

        return OrderOut(
            id=order_id,
            created_at=created_at,
            total=total,
            items=items,
        )
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()


def list_orders() -> list[OrderOut]:
    connection = get_connection()
    try:
        order_rows = connection.execute(
            "SELECT * FROM orders ORDER BY id DESC"
        ).fetchall()

        orders: list[OrderOut] = []
        for order_row in order_rows:
            item_rows = connection.execute(
                """
                SELECT product_id, product_name, unit_price, quantity, subtotal
                FROM order_items
                WHERE order_id = ?
                ORDER BY id ASC
                """,
                (order_row["id"],),
            ).fetchall()

            orders.append(
                OrderOut(
                    id=order_row["id"],
                    created_at=datetime.fromisoformat(order_row["created_at"]),
                    total=order_row["total"],
                    items=[
                        OrderItemOut(
                            product_id=item["product_id"],
                            product_name=item["product_name"],
                            unit_price=item["unit_price"],
                            quantity=item["quantity"],
                            subtotal=item["subtotal"],
                        )
                        for item in item_rows
                    ],
                )
            )

        return orders
    finally:
        connection.close()
