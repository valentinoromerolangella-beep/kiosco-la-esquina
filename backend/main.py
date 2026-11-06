from __future__ import annotations

import os
from contextlib import asynccontextmanager
from datetime import datetime, timezone

import uvicorn
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

import crud
from database import DB_PATH, init_db
from schemas import HealthOut, OrderCreate, OrderOut, ProductOut


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="Kiosco La Esquina API",
    description="API para el catálogo y los pedidos del Kiosco La Esquina.",
    version="1.0.0",
    lifespan=lifespan,
)

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "FRONTEND_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["General"])
def root() -> dict[str, str]:
    return {
        "message": "API del Kiosco La Esquina",
        "docs": "/docs",
    }


@app.get("/api/health", response_model=HealthOut, tags=["General"])
def health() -> HealthOut:
    return HealthOut(
        status="ok",
        database=str(DB_PATH),
        server_time=datetime.now(timezone.utc),
    )


@app.get("/api/products", response_model=list[ProductOut], tags=["Productos"])
def get_products() -> list[ProductOut]:
    """Devuelve todos los productos disponibles con su stock actual."""
    return crud.list_products()


@app.get("/api/products/{product_id}", response_model=ProductOut, tags=["Productos"])
def get_product(product_id: int) -> ProductOut:
    """Devuelve el detalle de un producto por su id."""
    product = crud.get_product(product_id)
    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado.",
        )
    return product


@app.post(
    "/api/orders",
    response_model=OrderOut,
    status_code=status.HTTP_201_CREATED,
    tags=["Pedidos"],
)
def create_order(payload: OrderCreate) -> OrderOut:
    """Registra un pedido y descuenta el stock de cada producto."""
    try:
        return crud.create_order(payload)
    except crud.ProductNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"El producto con id {error.product_id} no existe.",
        ) from error
    except crud.InsufficientStockError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                f'No hay stock suficiente de "{error.name}". '
                f"Disponible: {error.available}, solicitado: {error.requested}."
            ),
        ) from error


@app.get("/api/orders", response_model=list[OrderOut], tags=["Pedidos"])
def get_orders() -> list[OrderOut]:
    """Devuelve todos los pedidos registrados, del más nuevo al más antiguo."""
    return crud.list_orders()


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
