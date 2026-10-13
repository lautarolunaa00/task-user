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

La ruta base de la API es `/api/task`.

### Registro e inicio de sesión

La ruta base de autenticación es `/api/auth`. El registro guarda la contraseña
hasheada con bcrypt; el login devuelve un token JWT válido por una hora.

#### Registrar un usuario

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "username": "ana",
  "email": "ana@example.com",
  "password": "mi-clave-segura"
}
```

#### Iniciar sesión

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "ana@example.com",
  "password": "mi-clave-segura"
}
```

La respuesta exitosa incluye el token en el campo `token`. Las rutas de tareas
siguen sin requerir autenticación, tal como indica la consigna.

### Obtener todas las tareas

```http
GET /api/task
```

Ejemplo:

```bash
curl http://localhost:4500/api/task
```

Respuesta aproximada:

```json
{
  "tasks": []
}
```

### Crear una tarea

```http
POST /api/task
Content-Type: application/json
```

Ejemplo:

```bash
curl -X POST http://localhost:4500/api/task \
  -H "Content-Type: application/json" \
  -d '{"title":"Estudiar Express","description":"Repasar rutas y controladores"}'
```

Los campos disponibles son:

- `title`: título de la tarea. Es obligatorio.
- `description`: descripción de la tarea. Es opcional.
- `completed`: estado de la tarea. Por defecto es `false`.
- `createdAt`: fecha de creación generada automáticamente.

### Actualizar y eliminar tareas

Las rutas ya están declaradas, pero todavía funcionan como respuestas de ejemplo y no modifican la base de datos:

```http
PUT /api/task/:id
DELETE /api/task/:id
```

## Estructura del proyecto

```text
.
├── config/
│   └── database.js          # Conexión con MongoDB
├── controllers/
│   └── taskControllers.js   # Lógica de la API de tareas
├── models/
│   └── task.js              # Esquema Mongoose de una tarea
├── public/
│   ├── app.js               # Lógica del juego de memoria
│   ├── index.html           # Interfaz principal
│   └── styles.css           # Estilos de la interfaz
├── routes/
│   └── taskRoutes.js        # Rutas REST de tareas
├── index.js                 # Punto de entrada del servidor
├── package.json
└── pnpm-lock.yaml
```

## Scripts disponibles

Actualmente no hay scripts personalizados configurados en `package.json`. Para ejecutar el proyecto se utiliza:

```bash
node index.js
```

## Estado del proyecto

El proyecto se encuentra en desarrollo. La consulta y creación de tareas están conectadas con MongoDB. La actualización y eliminación de tareas están definidas en el router, pero todavía requieren implementar su lógica en los controladores.

## Autor

Proyecto realizado como parte de la cursada de Desarrollo Web.
