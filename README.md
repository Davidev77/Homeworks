# Firebase Taskboard

Aplicación web para organizar tareas personales con autenticación y sincronización en Firebase.

## Tecnologías

- Angular 18 y TypeScript.
- Firebase para Backend.
- Bootstrap 5 y Sass para la interfaz.

## Configuración de Firebase

La configuración de Firebase se encuentra en `src/firebase/config.ts`.

## Ejecutar la aplicación

Requiere Node.js y npm.

```bash
npm install
npm start
```

La aplicación estará disponible en `http://localhost:4200/`. Para generar una compilación de producción:

```bash
npm run build
```

## Organización del código

- `src/app/pages/`: páginas de inicio de sesión, registro y tareas.
- `src/app/services/`: acceso a Firebase Authentication y Cloud Firestore.
- `src/app/hooks/`: estado y operaciones de autenticación y tareas.
- `src/app/guards/`: protección de rutas para usuarios autenticados y visitantes.
- `src/firebase/config.ts`: inicialización y configuración de Firebase.
- `src/styles.scss` y `src/styles/`: estilos globales, Bootstrap y variables Sass.


