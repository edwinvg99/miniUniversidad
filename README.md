# MiniUniversidad

MiniUniversidad es una aplicación web fullstack para la gestión universitaria, que permite a estudiantes y profesores interactuar con cursos, materias y matrículas. El sistema está dividido en dos partes: un cliente (frontend) desarrollado con React y un servidor (backend) construido con Node.js y Express.

## Características principales
- Registro y autenticación de usuarios (estudiantes y profesores)
- Visualización y gestión de cursos y materias
- Matrícula de estudiantes en cursos
- Panel de administración para gestión de cursos y materias
- Interfaz moderna y responsiva

---

## Estructura del proyecto

```
miniuniversidad/
├── client/   # Frontend React
└── server/   # Backend Node.js/Express
```

### Frontend (`client/`)
- **src/components/**: Componentes reutilizables y rutas protegidas
- **src/context/**: Contexto de autenticación
- **src/pages/**: Páginas principales (inicio, login, cursos, administración, etc.)
- **public/**: Recursos estáticos
- **App.jsx**: Componente principal

### Backend (`server/`)
- **models/**: Modelos de datos (Usuario, Curso, Materia, Matrícula)
- **controllers/**: Lógica de negocio y manejo de peticiones
- **routes/**: Rutas de la API REST
- **middleware/**: Middlewares (autenticación, etc.)
- **config/**: Configuración de la base de datos
- **utils/**: Utilidades (generación de tokens)

---

## Instalación y ejecución

### 1. Clonar el repositorio
```bash
git clone https://github.com/edwinvg99/miniUniversidad.git
cd miniUniversidad
```

### 2. Configurar el backend
```bash
cd server
npm install
```
- Configura las variables de entorno en `.env` (ejemplo: conexión a MongoDB)
- Inicia el servidor:
```bash
npm start
```

### 3. Configurar el frontend
```bash
cd ../client
npm install
```
- Inicia la aplicación React:
```bash
npm run dev
```

### 4. Acceso
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:5000](http://localhost:5000)

---

## Uso básico
1. **Registro/Login:** Los usuarios pueden registrarse y autenticarse.
2. **Estudiantes:** Pueden ver cursos disponibles, inscribirse y consultar sus materias.
3. **Profesores:** Pueden ver los cursos que imparten y gestionar materias.
4. **Administradores:** Acceso a paneles para crear, editar y eliminar cursos y materias.

---

## Tecnologías utilizadas
- **Frontend:** React, Vite, Context API, CSS
- **Backend:** Node.js, Express, MongoDB, JWT

---

## Contribuir
Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para sugerencias o mejoras.

---

## Licencia
Este proyecto está bajo la licencia MIT.