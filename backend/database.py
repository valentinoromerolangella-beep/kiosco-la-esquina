from __future__ import annotations

import os
import sqlite3
from pathlib import Path

from dotenv import load_dotenv

from models import CREATE_TABLES_SQL, INSERT_PRODUCT_SQL, SEED_PRODUCTS

BASE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BASE_DIR.parent

load_dotenv(PROJECT_DIR / ".env")

DB_PATH = Path(os.getenv("DATABASE_PATH", str(BASE_DIR / "database.db"))).resolve()


def get_connection() -> sqlite3.Connection:
    """Crea una conexión SQLite con filas accesibles por nombre."""
    connection = sqlite3.connect(DB_PATH, timeout=15, isolation_level=None)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def init_db() -> None:
    """Crea las tablas y carga los productos de ejemplo si la base está vacía."""
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    connection = get_connection()
    try:
        connection.executescript(CREATE_TABLES_SQL)

        product_count = connection.execute(
            "SELECT COUNT(*) AS total FROM products"
        ).fetchone()["total"]

        if product_count == 0:
            connection.executemany(INSERT_PRODUCT_SQL, SEED_PRODUCTS)

        connection.commit()
    finally:
        connection.close()
