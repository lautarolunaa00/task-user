# Server Web | API (introductorio)

Aplicación web desarrollada con Node.js, Express y MongoDB. El proyecto incluye una interfaz de juego de memoria y una API REST inicial para gestionar tareas.

## Características

- Servidor HTTP desarrollado con Express.
- Frontend estático servido desde la carpeta `public/`.
- Juego de memoria con cartas de emojis y detección de pares.
- Conexión a MongoDB mediante Mongoose.
- API para consultar y crear tareas.
- Estructura separada por rutas, controladores, modelos y configuración.

## Tecnologías

- Node.js
- Express 5
- MongoDB
- Mongoose
- Bootstrap 5
- JavaScript ES Modules
- pnpm

## Requisitos previos

- Node.js instalado.
- pnpm instalado.
- MongoDB ejecutándose de forma local en el puerto predeterminado `27017`.

La aplicación utiliza la siguiente conexión de base de datos:

```text
mongodb://127.0.0.1:27017/web24
```

## Instalación

1. Clonar el repositorio:

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd server
   ```

2. Instalar las dependencias:

   ```bash
   pnpm install
   ```

3. Crear el archivo de configuración local. En PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

   Editar `.env` y reemplazar `JWT_SECRET` por una clave secreta propia.

4. Iniciar MongoDB de forma local.

5. Iniciar el servidor:

   ```bash
   pnpm dev
   ```

El servidor quedará disponible en:

```text
http://localhost:4500
```

Al abrir esa dirección se carga la interfaz web ubicada en `public/`.

## API REST

### Autenticación (`/api/auth`)

#### 1. Registro de usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "usuario1",
  "email": "usuario1@test.com",
  "password": "password123"
}
```
- **Respuesta (201 Created):**
```json
{
  "ok": true,
  "msg": "Usuario registrado correctamente"
}
```
- **Error de validación (400 Bad Request):**
```json
{
  "ok": false,
  "errors": {
    "email": {
      "msg": "El email ya está registrado"
    }
  }
}
```

#### 2. Inicio de sesión (Login)
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario1@test.com",
  "password": "password123"
}
```
- **Respuesta (200 OK):** *(También setea automáticamente la cookie `token`)*
```json
{
  "msg": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
- **Error credenciales inválidas (401 Unauthorized):**
```json
{
  "msg": "Credenciales incorrectas"
}
```

---

### Autenticación en rutas protegidas
Las rutas de tareas (`/api/tasks`) y las operaciones para crear, actualizar o inactivar categorías requieren que el usuario esté autenticado. Se puede enviar el token de dos formas:
1. **Cookie:** Se almacena de manera automática tras realizar el login.
2. **Body:** Enviando el token dentro del cuerpo JSON en la petición:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
- **Error sin autenticación (401 Unauthorized):**
```json
{
  "ok": false,
  "message": "La autenticación es requerida. Por favor envia un token"
}
```

---

### Categorías (`/api/categories`)
Las rutas `POST`, `PUT` y `DELETE` requieren autenticación mediante cookie tras iniciar sesión o enviando `"token"` en el cuerpo de la petición. Las rutas `GET` son públicas.

#### 1. Obtener todas las categorías
```http
GET /api/categories
```
- **Respuesta (200 OK):**
```json
{
  "categories": [
    {
      "_id": "67140f0c9b1b1a0012345678",
      "nombre": "Trabajo",
      "estado": true,
      "usuario": {
        "_id": "67140e0c9b1b1a0012345670",
        "username": "ana",
        "email": "ana@example.com"
      },
      "createdAt": "2026-10-19T14:00:00.000Z",
      "updatedAt": "2026-10-19T14:00:00.000Z"
    }
  ]
}
```

#### 2. Obtener categoría por ID
```http
GET /api/categories/:id
```
- **Respuesta (200 OK):** `{ "category": { ... } }`
- **Error (404 Not Found):** `{ "msg": "Categoría no encontrada" }`
- **Error (400 Bad Request):** `{ "msg": "El ID proporcionado no es un ObjectId válido" }`

#### 3. Crear categoría
```http
POST /api/categories
Content-Type: application/json
Authorization: Bearer <TOKEN> (opcional)

{
  "nombre": "Estudio",
  "estado": true
}
```
- **Respuesta (201 Created):**
```json
{
  "msg": "Categoría creada exitosamente",
  "category": {
    "_id": "67140f0c9b1b1a0012345679",
    "nombre": "Estudio",
    "estado": true
  }
}
```
- **Error de validación (400 Bad Request):**
```json
{
  "msg": "Errores de validación",
  "errors": [
    "El campo 'nombre' debe tener entre 3 y 50 caracteres"
  ]
}
```
- **Error nombre duplicado (400 Bad Request):**
```json
{
  "msg": "Ya existe una categoría con ese nombre"
}
```

#### 4. Actualizar categoría
```http
PUT /api/categories/:id
Content-Type: application/json

{
  "nombre": "Estudio Avanzado",
  "estado": true
}
```
- **Respuesta (200 OK):** `{ "msg": "Categoría actualizada exitosamente", "category": { ... } }`
- **Error (404 Not Found):** `{ "msg": "Categoría no encontrada" }`

#### 5. Inactivar categoría (Soft delete)
```http
DELETE /api/categories/:id
```
- **Respuesta (200 OK):**
```json
{
  "msg": "Categoría inactivada exitosamente",
  "category": {
    "_id": "67140f0c9b1b1a0012345679",
    "nombre": "Estudio Avanzado",
    "estado": false
  }
}
```

---

### Tareas (`/api/tasks`)
*Requiere autenticación (mediante cookie tras iniciar sesión o enviando `"token"` en el body).*

#### 1. Obtener todas las tareas del usuario logueado
```http
GET /api/tasks
```
- **Respuesta (200 OK):**
```json
{
  "tasks": [
    {
      "_id": "6714100c9b1b1a0012345680",
      "titulo": "Preparar clase",
      "descripcion": "Estudiar controladores y validaciones",
      "fechaEntrega": "2026-10-25T00:00:00.000Z",
      "completada": false,
      "categoria": {
        "_id": "67140f0c9b1b1a0012345679",
        "nombre": "Estudio",
        "estado": true
      },
      "usuario": {
        "_id": "67140e0c9b1b1a0012345670",
        "username": "ana",
        "email": "ana@example.com"
      }
    }
  ]
}
```

#### 2. Obtener tarea por ID
```http
GET /api/tasks/:id
```
- **Respuesta (200 OK):** `{ "task": { ... } }`
- **Error (404 Not Found):** `{ "msg": "Tarea no encontrada" }`

#### 3. Crear tarea
```http
POST /api/tasks
Content-Type: application/json

{
  "token": "<TOKEN_JWT>",
  "titulo": "Aprender Express",
  "descripcion": "Repasar middlewares y validaciones",
  "fechaEntrega": "2026-10-30",
  "completada": false,
  "categoria": "67140f0c9b1b1a0012345679"
}
```
- **Respuesta (201 Created):**
```json
{
  "msg": "Tarea creada exitosamente",
  "task": { ... }
}
```
- **Error de categoría inexistente (404 Not Found):**
```json
{
  "msg": "La categoría especificada no existe"
}
```
- **Error de validación (400 Bad Request):**
```json
{
  "msg": "Errores de validación",
  "errors": [
    "El campo 'titulo' es obligatorio y debe ser un texto"
  ]
}
```

#### 4. Actualizar tarea
```http
PUT /api/tasks/:id
Content-Type: application/json

{
  "completada": true
}
```
- **Respuesta (200 OK):** `{ "msg": "Tarea actualizada exitosamente", "task": { ... } }`

#### 5. Eliminar tarea
```http
DELETE /api/tasks/:id
```
- **Respuesta (200 OK):** `{ "msg": "Tarea eliminada exitosamente" }`
- **Error (404 Not Found):** `{ "msg": "Tarea no encontrada" }`

---

## Estructura del proyecto

```text
.
├── src/
│   ├── config/
│   │   └── database.js               # Conexión con MongoDB
│   ├── controllers/
│   │   ├── auth.controller.js        # Lógica de registro y login
│   │   ├── category.controller.js    # Lógica CRUD de categorías
│   │   └── task.controller.js        # Lógica CRUD de tareas
│   ├── middlewares/
│   │   ├── auth.js                   # Middleware JWT verifyToken
│   │   └── validators.js             # Validaciones de ID, categorías y tareas
│   ├── models/
│   │   ├── User.js                   # Modelo de Usuario
│   │   ├── category.js               # Modelo de Categoría
│   │   └── Task.js                   # Modelo de Tarea
│   └── routes/
│       ├── auth.routes.js            # Rutas de autenticación
│       ├── category.routes.js        # Rutas de categorías
│       └── task.routes.js            # Rutas de tareas
├── public/                           # Frontend estático
├── index.js                          # Punto de entrada del servidor
├── package.json
└── pnpm-lock.yaml
```
