# 🛒 Kiosco El Rápido

Aplicación web completa para un kiosco de barrio. Permite consultar el catálogo,
filtrar productos por categoría, ver el detalle de cada uno, armar un carrito y
registrar pedidos que descuentan el stock real en la base de datos.

El proyecto está dividido en un **frontend SPA** (React + TypeScript + Vite) y un
**backend REST** (FastAPI + SQLite + Pydantic).

---

## 📌 Descripción

**Kiosco El Rápido** simula el comercio online de un kiosco de barrio. Los
clientes pueden recorrer el catálogo, buscar productos, filtrarlos por categoría,
revisar el stock disponible y confirmar un pedido. El backend valida la
existencia de los productos, comprueba el stock, calcula el total con los precios
de la base de datos y descuenta las unidades vendidas.

### Objetivos

- Aplicar React con TypeScript, componentes, hooks y React Router.
- Implementar un estado global de carrito con `useContext` + `useState`.
- Desarrollar una API REST con FastAPI, Pydantic y SQLite.
- Integrar frontend y backend con un servicio centralizado de HTTP.
- Practicar validación de datos, manejo de errores y control de stock.
- Organizar el proyecto y documentarlo para su entrega mediante GitHub.

---

## 🧰 Tecnologías utilizadas

### Frontend

| Tecnología | Uso |
| --- | --- |
| React 18 | Interfaz de usuario basada en componentes |
| TypeScript | Tipado estático |
| Vite 8 | Entorno de desarrollo y build |
| React Router DOM 7 | Ruteo SPA, links y query params |
| CSS | Diseño responsive, animaciones y variables de color |
| `useState`, `useEffect`, `useContext` | Estado local, efectos y carrito global |
| `useParams`, `useSearchParams` | Detalle de producto y filtros por URL |

### Backend

| Tecnología | Uso |
| --- | --- |
| Python 3.12 | Lenguaje del servidor |
| FastAPI | Framework de la API REST |
| SQLite | Base de datos relacional embebida |
| Pydantic v2 | Validación de entrada y salida |
| Uvicorn | Servidor ASGI |
| python-dotenv | Lectura de variables de entorno |

### Control de versiones

- Git
- GitHub

---

## 📁 Estructura del proyecto

```text
kiosco-el-rapido/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── CartItem.tsx
│   │   │   └── Toast.tsx
│   │   ├── context/
│   │   │   └── CartContext.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Products.tsx
│   │   │   ├── ProductDetail.tsx
│   │   │   ├── Cart.tsx
│   │   │   └── NotFound.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── data/
│   │   │   └── products.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── vite-env.d.ts
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── crud.py
│   ├── requirements.txt
│   └── database.db          # Se genera/verifica al iniciar el backend
├── docs/
│   └── screenshots/         # Carpeta preparada para las capturas
├── .env.example
├── .gitignore
└── README.md
```

> `node_modules/`, `backend/.venv/`, los archivos `__pycache__/` y los `.env`
> locales no se suben al repositorio (ver `.gitignore`).

---

## ✨ Funcionalidades

### Frontend

- **Home** con presentación del kiosco, categorías destacadas y productos
  recomendados obtenidos desde la API.
- **Catálogo** con todos los productos, precio en pesos argentinos, categoría,
  stock y acciones.
- **Filtros por categoría** mediante query params:
  - `/products?category=bebidas`
  - `/products?category=snacks`
  - `/products?category=golosinas`
  - `/products?category=varios`
- **Búsqueda** por nombre o descripción usando `useSearchParams`.
- **Detalle** de producto con selector de cantidad limitado por stock.
- **Carrito global** con:
  - agregar productos,
  - modificar cantidades,
  - eliminar productos,
  - subtotales y total,
  - vaciar carrito,
  - persistencia en `localStorage`,
  - control de stock,
  - notificaciones visuales (toast).
- **Finalización de pedido** integrada con el backend:
  - indicador de carga,
  - confirmación con número de pedido y total,
  - errores visibles y carrito conservado si falla,
  - vaciado del carrito solo si el pedido se registra correctamente.
- **Página 404** y **producto no encontrado**.
- Diseño responsive (escritorio, tablet y celular) con colores verde oscuro,
  blanco y amarillo, animaciones suaves e iconos/emojis.

### Backend

- Catálogo almacenado en SQLite con 10 productos iniciales.
- Validación de datos con Pydantic.
- Registro de pedidos en una transacción.
- Cálculo del total **exclusivamente con los precios de la base de datos**.
- Verificación de existencia de productos y stock suficiente.
- Descuento automático de stock.
- CORS configurable para el frontend.
- Documentación interactiva automática en `/docs`.

---

## ⚙️ Requisitos previos

- [Node.js](https://nodejs.org/) **20.19+** o **22.12+** (probado con Node 24).
- [Python](https://www.python.org/) **3.10+** (probado con Python 3.12).
- Git.
- Visual Studio Code (recomendado).

Verificar versiones:

```bash
node --version
npm --version
python --version
git --version
```

---

## 🚀 Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone <URL-del-repositorio>
cd kiosco-el-rapido
```

### 2. Variables de entorno (opcional)

El proyecto funciona sin `.env` gracias al proxy de Vite. Para personalizar la
configuración:

```bash
# Windows PowerShell
Copy-Item .env.example .env

# Linux / macOS
cp .env.example .env
```

Variables disponibles:

| Variable | Descripción | Valor por defecto |
| --- | --- | --- |
| `VITE_API_URL` | URL base de la API para el frontend | `/api` (proxy de Vite) |
| `FRONTEND_ORIGINS` | Orígenes permitidos por CORS, separados por coma | `http://localhost:5173,http://127.0.0.1:5173` |
| `DATABASE_PATH` | Ruta opcional del archivo SQLite | `backend/database.db` |

### 3. Ejecutar el backend

Desde la raíz del proyecto:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

En Linux / macOS:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

- API: <http://localhost:8000>
- Documentación Swagger: <http://localhost:8000/docs>
- Documentación ReDoc: <http://localhost:8000/redoc>

Al iniciar por primera vez se crea `backend/database.db` y se cargan los 10
productos de ejemplo automáticamente.

### 4. Ejecutar el frontend

En **otra terminal**, desde la raíz:

```powershell
cd frontend
npm install
npm run dev
```

Abrir <http://localhost:5173>.

> El proxy de Vite redirige `/api` a `http://127.0.0.1:8000`, por lo que no hace
> falta configurar CORS para el entorno de desarrollo. Si se define
> `VITE_API_URL`, el frontend llamará directamente a esa URL y el backend deberá
> permitir el origen correspondiente.

### 5. Compilar para producción

```bash
cd frontend
npm run build
npm run preview
```

---

## 🖥️ Ejecutar desde Visual Studio Code

1. Abrir la carpeta `kiosco-el-rapido` con **Archivo → Abrir carpeta**.
2. Abrir la terminal integrada con `Ctrl + ñ` (o `Ctrl + ~`).
3. **Terminal 1 – backend:**

   ```powershell
   cd backend
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```

4. **Terminal 2 – frontend** (usar el botón `+` de la terminal):

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

5. Abrir <http://localhost:5173> en el navegador.

Extensiones recomendadas: **ESLint**, **Prettier**, **Python**, **Pylance** y
**Error Lens**.

Si PowerShell bloquea la activación del entorno virtual, ejecutar una vez:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

---

## 🔌 Endpoints disponibles

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/` | Información básica de la API |
| `GET` | `/api/health` | Estado del servidor y ruta de la base |
| `GET` | `/api/products` | Lista todos los productos |
| `GET` | `/api/products/{id}` | Detalle de un producto |
| `POST` | `/api/orders` | Registra un pedido y descuenta stock |
| `GET` | `/api/orders` | Lista los pedidos registrados |

### `POST /api/orders`

El frontend **no envía precios**. Solo envía el id y la cantidad; el backend
obtiene el precio actual de SQLite.

```json
{
  "items": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 4, "quantity": 1 }
  ]
}
```

Respuesta `201 Created`:

```json
{
  "id": 1,
  "created_at": "2026-11-05T14:32:10+00:00",
  "total": 5100.0,
  "items": [
    {
      "product_id": 1,
      "product_name": "Coca-Cola 500ml",
      "unit_price": 1800.0,
      "quantity": 2,
      "subtotal": 3600.0
    },
    {
      "product_id": 4,
      "product_name": "Alfajor Jorgito",
      "unit_price": 1500.0,
      "quantity": 1,
      "subtotal": 1500.0
    }
  ]
}
```

Posibles errores:

| Código | Caso |
| --- | --- |
| `404` | Producto inexistente |
| `409` | Stock insuficiente |
| `422` | Datos inválidos (lista vacía, cantidad ≤ 0, etc.) |

Ejemplo de error de stock:

```json
{
  "detail": "No hay stock suficiente de \"Coca-Cola 500ml\". Disponible: 22, solicitado: 999."
}
```

---

## 🗄️ Base de datos

Se utiliza SQLite con tres tablas:

- `products`: catálogo, precio y stock.
- `orders`: cabecera del pedido (fecha y total).
- `order_items`: detalle del pedido con precio unitario y subtotal históricos.

El archivo `backend/database.db` se incluye con el catálogo inicial. Si se
elimina, `database.py` lo vuelve a crear y siembra automáticamente al iniciar el
backend.

---

## ✅ Comprobaciones realizadas

Las siguientes verificaciones se ejecutaron durante el desarrollo:

- `npm install` sin vulnerabilidades reportadas.
- `npm run build` (`tsc -b && vite build`) finalizado sin errores de TypeScript.
- Backend iniciado con Uvicorn y respuesta correcta en `/api/health`.
- `GET /api/products` devuelve los 10 productos.
- `GET /api/products/{id}` devuelve el detalle y `404` para ids inexistentes.
- `POST /api/orders`:
  - calcula el total en el backend,
  - registra el pedido,
  - descuenta el stock,
  - devuelve `409` cuando no hay stock,
  - devuelve `404` con productos inexistentes,
  - devuelve `422` con datos inválidos,
  - combina productos repetidos en una misma orden.
- Prueba E2E en Chrome headless (Playwright) sobre la aplicación integrada:
  - Home, navegación y catálogo.
  - Filtro por categoría y búsqueda.
  - Detalle, selector de cantidad y límite por stock.
  - Agregar al carrito, modificar cantidad y total.
  - Error de stock simulado: mensaje visible y carrito conservado.
  - Pedido exitoso, número de pedido y vaciado del carrito.
  - Descuento de stock comprobado contra la API.
  - Páginas de producto no encontrado y 404.
- Base de datos restaurada a su estado inicial (stock completo, sin pedidos)
  antes de la entrega.

Para repetir las verificaciones básicas:

```powershell
cd frontend
npm run build
```

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn main:app --reload --port 8000
```

Luego abrir <http://localhost:8000/docs> y probar los endpoints, o ejecutar el
frontend y recorrer el flujo de compra.

---

## 📸 Capturas de pantalla

> Sección preparada para agregar las capturas antes de la entrega. Guardar las
> imágenes en `docs/screenshots/` con los nombres sugeridos.

| Pantalla | Archivo sugerido |
| --- | --- |
| Home | `docs/screenshots/home.png` |
| Catálogo con filtros | `docs/screenshots/products.png` |
| Detalle de producto | `docs/screenshots/product-detail.png` |
| Carrito | `docs/screenshots/cart.png` |
| Pedido confirmado | `docs/screenshots/order-success.png` |

<!--
Cuando estén disponibles las imágenes, reemplazar este comentario por:

![Home](docs/screenshots/home.png)
![Catálogo](docs/screenshots/products.png)
![Detalle](docs/screenshots/product-detail.png)
![Carrito](docs/screenshots/cart.png)
![Pedido confirmado](docs/screenshots/order-success.png)
-->

---

## 📤 Publicación en GitHub

El repositorio local ya está inicializado con commits descriptivos. Para
publicarlo, primero crear el repositorio remoto (desde GitHub o con GitHub CLI) y
luego:

```bash
git remote add origin <URL-del-repositorio>
git push -u origin main
```

> **Importante:** no se configuró ninguna URL remota ni se realizó ningún push
> automáticamente. El destino debe ser confirmado antes de publicar.

---

## 👤 Autor

Trabajo práctico de programación — **Kiosco El Rápido**.
