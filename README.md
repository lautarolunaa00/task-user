# Server Web | API

API REST y sitio web estático desarrollados con Node.js, Express y MongoDB. Incluye autenticación JWT y gestión de tareas, categorías y productos.

## Requisitos

- Node.js y pnpm.
- Una base de datos MongoDB local o en Atlas.

## Configuración

Instala las dependencias y crea `.env` en la raíz del proyecto:

```bash
pnpm install
```

```env
MONGO_URI=mongodb://127.0.0.1:27017/api-rest
JWT_SECRET=define-una-clave-segura
JWT_EXPIRES=1h
NODE_ENV=development
```

Para MongoDB Atlas, reemplaza `MONGO_URI` por el URI del clúster. Si Node muestra `querySrv ECONNREFUSED`, agrega:

```env
DNS_SERVERS=1.1.1.1,1.0.0.1
```

No compartas ni subas `.env`. Las variables `EMAIL_*` pueden configurarse para SMTP, pero el proyecto todavía no envía correos.

## Iniciar

```bash
pnpm dev
```

Para iniciar sin reinicio automático:

```bash
pnpm start
```

El servidor y el sitio quedan disponibles en <http://localhost:4500>.

## API

Las rutas de autenticación son públicas. Las de tareas requieren autenticación; las rutas de escritura de categorías y productos también.

| Recurso       | Rutas                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------- |
| Autenticación | `POST /api/auth/register`, `POST /api/auth/login`                                              |
| Tareas        | `GET`, `POST /api/tasks`; `GET`, `PUT`, `DELETE /api/tasks/:id`                                |
| Categorías    | `GET /api/categories`, `GET /api/categories/:id`; `POST`, `PUT`, `DELETE /api/categories/:id`  |
| Productos     | `GET /api/products`; `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id` |

El registro recibe `username`, `email` y `password` como JSON. El login recibe `email` y `password`; al iniciar sesión, la API devuelve un JWT y lo establece en una cookie.
