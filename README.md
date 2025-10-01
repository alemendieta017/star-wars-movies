# 🎬 Star Wars Movies API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-22-green" alt="Node.js Version" />
  <img src="https://img.shields.io/badge/NestJS-11-red" alt="NestJS Version" />
  <img src="https://img.shields.io/badge/MongoDB-8.0-blue" alt="MongoDB Version" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-blue" alt="TypeScript Version" />
  <img src="https://img.shields.io/badge/Architecture-Clean%20Architecture-orange" alt="Architecture" />
</p>

## 📋 Descripción

API REST para la gestión de películas de Star Wars construida con **NestJS** y **Clean Architecture**. La aplicación permite gestionar películas, usuarios y autenticación con JWT, además de sincronizar datos con la API externa de Star Wars (SWAPI).

### ✨ Características Principales

- 🏗️ **Clean Architecture** - Separación clara de responsabilidades
- 🔐 **Autenticación JWT** - Sistema de autenticación seguro
- 👥 **Gestión de Usuarios** - Roles y permisos
- 🎬 **CRUD de Películas** - Operaciones completas de gestión
- 🔄 **Sincronización SWAPI** - Integración con API externa
- 📚 **Documentación Swagger** - API documentada automáticamente
- 🧪 **Testing** - Cobertura de tests unitarios
- 🐳 **Docker** - Containerización lista para producción

## 🏗️ Arquitectura

La aplicación sigue los principios de **Clean Architecture** con las siguientes capas:

```
src/
├── auth/                    # Módulo de autenticación
│   ├── guards/             # Guards de autenticación y autorización
│   ├── strategies/         # Estrategias de Passport (JWT, Local)
│   └── infrastructure/     # DTOs y controladores
├── movies/                 # Módulo de películas
│   ├── application/        # Casos de uso (Use Cases)
│   ├── domain/            # Modelos de dominio y repositorios
│   └── infrastructure/    # Implementaciones concretas
├── users/                 # Módulo de usuarios
│   ├── application/       # Casos de uso
│   ├── domain/           # Modelos de dominio
│   └── infrastructure/   # Implementaciones
└── shared/               # Utilidades compartidas
    └── pipes/           # Pipes de validación
```

### 🎯 Principios de Clean Architecture

1. **Domain Layer** - Modelos de negocio y interfaces de repositorios
2. **Application Layer** - Casos de uso y lógica de aplicación
3. **Infrastructure Layer** - Implementaciones concretas (MongoDB, APIs externas)
4. **Presentation Layer** - Controladores y DTOs

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 22+
- MongoDB 8.0+
- npm o yarn

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de datos
MONGO_URI=mongodb://localhost:27017/star-wars-movie-db

# JWT
JWT_SECRET=clave-secreta

# Puerto de la aplicación
PORT=3000

# SWAPI
SWAPI_URL=https://www.swapi.tech/api
```

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd star-wars-movies

# Instalar dependencias
npm install

# Iniciar MongoDB (si no está corriendo)
# En Windows con MongoDB Compass o servicio
# En Linux/Mac: sudo systemctl start mongod

# Ejecutar en modo desarrollo
npm run start:dev
```

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run start:dev          # Modo desarrollo con hot reload
npm run start:debug        # Modo debug con watch

# Producción
npm run build              # Compilar TypeScript
npm run start:prod         # Ejecutar en modo producción

# Testing
npm run test               # Tests unitarios
npm run test:watch         # Tests en modo watch
npm run test:cov           # Tests con cobertura
npm run test:e2e           # Tests end-to-end

# Calidad de código
npm run lint               # Linter con auto-fix
npm run format             # Formatear código con Prettier
```

## 🐳 Docker

### 🚀 Levantar la aplicación con Docker Compose (Recomendado)

La forma más fácil de levantar la aplicación completa es usando Docker Compose. El proyecto incluye un archivo `docker-compose.yml` que configura automáticamente la aplicación y MongoDB.

#### Prerrequisitos
- Docker Desktop instalado y ejecutándose
- Puerto 3000 y 27017 disponibles

#### Pasos para levantar la aplicación

1. **Clonar el repositorio** (si no lo has hecho):
```bash
git clone <repository-url>
cd star-wars-movies
```

2. **Levantar todos los servicios**:
```bash
# Levantar en segundo plano
docker-compose up -d

# O levantar y ver logs en tiempo real
docker-compose up
```

3. **Verificar que los servicios estén corriendo**:
```bash
# Ver estado de los contenedores
docker-compose ps

# Ver logs de la aplicación
docker-compose logs -f app

# Ver logs de MongoDB
docker-compose logs -f mongo
```

4. **Acceder a la aplicación**:
- **API**: http://localhost:3000
- **Swagger UI**: http://localhost:3000/docs
- **MongoDB**: localhost:27017

#### Comandos útiles de Docker Compose

```bash
# Parar todos los servicios
docker-compose down

# Parar y eliminar volúmenes (⚠️ elimina datos de MongoDB)
docker-compose down -v

# Reconstruir la imagen de la aplicación
docker-compose up --build

# Ver logs en tiempo real
docker-compose logs -f

# Ejecutar comandos dentro del contenedor de la app
docker-compose exec app npm run test
docker-compose exec app npm run lint

# Acceder al shell de MongoDB
docker-compose exec mongo mongosh
```

#### Solución de problemas comunes

**Puerto 3000 ocupado**:
```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "3001:3000"  # Usar puerto 3001 en lugar de 3000
```

**MongoDB no conecta**:
```bash
# Verificar que MongoDB esté corriendo
docker-compose logs mongo

# Reiniciar solo MongoDB
docker-compose restart mongo
```

**Aplicación no inicia**:
```bash
# Ver logs de la aplicación
docker-compose logs app

# Reconstruir sin caché
docker-compose build --no-cache
docker-compose up
```

### 🔧 Construir imagen manualmente

Si prefieres construir la imagen manualmente:

```bash
# Construir imagen
docker build -t star-wars-movies .

# Ejecutar contenedor (requiere MongoDB corriendo)
docker run -p 3000:3000 \
  -e MONGO_URI=mongodb://host.docker.internal:27017/star-wars-movie-db \
  -e JWT_SECRET=clave-secreta \
  -e SWAPI_URL=https://www.swapi.tech/api \
  star-wars-movies
```

### 📋 Estructura del Docker Compose

El archivo `docker-compose.yml` incluye:

- **Servicio `app`**: Aplicación NestJS
  - Puerto 3000 expuesto
  - Variables de entorno configuradas
  - Volúmenes para desarrollo (hot reload)
  - Dependencia de MongoDB

- **Servicio `mongo`**: Base de datos MongoDB
  - Puerto 27017 expuesto
  - Volumen persistente para datos
  - Red personalizada

- **Red `star-wars-network`**: Red aislada para los servicios

## 📚 Documentación de la API

Una vez que la aplicación esté ejecutándose, la documentación de Swagger estará disponible en:

- **Swagger UI**: http://localhost:3000/docs
- **JSON Schema**: http://localhost:3000/docs-json

### Endpoints Principales

#### 🔐 Autenticación
- `POST /auth/login` - Iniciar sesión

#### 🎬 Películas
- `GET /movies` - Listar películas (con paginación)
- `GET /movies/:id` - Obtener película por ID
- `POST /movies` - Crear película (requiere autenticación)
- `PATCH /movies/:id` - Actualizar película (requiere autenticación)
- `DELETE /movies/:id` - Eliminar película (requiere autenticación)
- `POST /movies/sync` - Sincronizar con SWAPI (requiere autenticación)

#### 👥 Usuarios
- `POST /users/register` - Crear usuario

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm run test

# Tests con cobertura
npm run test:cov

# Tests en modo watch
npm run test:watch

# Tests end-to-end
npm run test:e2e
```

La aplicación incluye tests unitarios para:
- ✅ Casos de uso
- ✅ Controladores
- ✅ Servicios
- ✅ Guards y estrategias
- ✅ Pipes de validación

## 🔧 Dependencias Principales

### Producción
- **@nestjs/core** - Framework principal
- **@nestjs/mongoose** - Integración con MongoDB
- **@nestjs/jwt** - Autenticación JWT
- **@nestjs/passport** - Estrategias de autenticación
- **@nestjs/swagger** - Documentación automática
- **mongoose** - ODM para MongoDB
- **bcryptjs** - Hash de contraseñas
- **class-validator** - Validación de DTOs

### Desarrollo
- **@nestjs/testing** - Testing utilities
- **jest** - Framework de testing
- **eslint** - Linter
- **prettier** - Formateador de código
- **typescript** - Compilador TypeScript

## 🏛️ Módulos de la Aplicación

### 🔐 AuthModule
- **Responsabilidad**: Autenticación y autorización
- **Características**:
  - JWT Strategy para tokens
  - Local Strategy para login
  - Guards de autenticación y roles
  - Decorador @Roles para control de acceso

### 🎬 MoviesModule
- **Responsabilidad**: Gestión de películas
- **Características**:
  - CRUD completo de películas
  - Sincronización con SWAPI
  - Paginación y filtros
  - Validación de MongoDB ObjectIds

### 👥 UsersModule
- **Responsabilidad**: Gestión de usuarios
- **Características**:
  - Creación de usuarios
  - Roles (USER, ADMIN)
  - Integración con AuthModule

## 🔒 Seguridad

- **JWT Tokens** con expiración de 24 horas
- **Bcrypt** para hash de contraseñas
- **Guards** para protección de rutas
- **Validación** de entrada con class-validator
- **Roles** para control de acceso granular

## 🚀 Despliegue

### Variables de Entorno de Producción

```env
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb://servidor-mongo:27017/star-wars-movie-db
JWT_SECRET=clave-secreta
```

### Comandos de Despliegue

```bash
# Construir para producción
npm run build

# Ejecutar en producción
npm run start:prod
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:

- 📧 Email: [amendieta017@gmail.com]
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/star-wars-movies/issues)
- 📖 Documentación: [NestJS Docs](https://docs.nestjs.com/)

---

<p align="center">
  Hecho con ❤️ usando <a href="https://nestjs.com">NestJS</a> y <a href="https://www.mongodb.com">MongoDB</a>
</p>
