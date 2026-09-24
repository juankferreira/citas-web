# citas-web

Cliente React + TypeScript del portal de citas, importado del prototipo aprobado y conectado directamente a `citas-api`.

## Desarrollo local

1. Copia `.env.example` a `.env.local` si la API no está en `http://localhost:8080`.
2. Ejecuta `npm install`.
3. Ejecuta `npm run dev` y abre `http://localhost:5173`.

El access JWT vive solo en memoria. El refresh JWT se recibe como cookie `HttpOnly` y se rota al restaurar la sesión. Las peticiones de login, refresh y logout incluyen credenciales y `X-Requested-With: XMLHttpRequest` conforme al contrato de seguridad.

## Verificación

```bash
npm run lint
npm test
npm run build
```

Las pantallas de agenda conservan datos sintéticos del prototipo hasta que sus HU backend sean implementadas. Recuperación de contraseña permanece fuera del alcance.
