from __future__ import annotations

from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field, field_validator

Category = Literal["bebidas", "snacks", "golosinas", "varios"]


class ProductOut(BaseModel):
    id: int
    name: str
    category: Category
    price: float
    stock: int
    description: str
    image: str


class OrderItemIn(BaseModel):
    product_id: int = Field(gt=0)
    quantity: int = Field(gt=0, le=999)


class OrderCreate(BaseModel):
    items: list[OrderItemIn] = Field(min_length=1, max_length=100)

    @field_validator("items")
    @classmethod
    def merge_duplicate_products(
        cls, items: list[OrderItemIn]
    ) -> list[OrderItemIn]:
        merged: dict[int, int] = {}
        for item in items:
            merged[item.product_id] = merged.get(item.product_id, 0) + item.quantity

        for product_id, quantity in merged.items():
            if quantity > 999:
                raise ValueError(
                    f"La cantidad total del producto {product_id} supera el máximo permitido (999)."
                )

        return [
            OrderItemIn(product_id=product_id, quantity=quantity)
            for product_id, quantity in merged.items()
        ]


class OrderItemOut(BaseModel):
    product_id: int
    product_name: str
    unit_price: float
    quantity: int
    subtotal: float


class OrderOut(BaseModel):
    id: int
    created_at: datetime
    total: float
    items: list[OrderItemOut]


class HealthOut(BaseModel):
    status: str
    database: str
    server_time: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
