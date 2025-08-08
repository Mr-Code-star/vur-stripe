
# Stripe Checkout – Vue 3 + Express (Node)

Proyecto base para mostrar planes de **Stripe** y redirigir a **Stripe Checkout** usando **Vue 3 + Vite** en el frontend y **Express** en el backend.

---

## 🧱 Estructura

```
stripe-vue/
├─ server/
│  ├─ server.js          # Backend Express (rutas /api/prices y /api/checkout)
│  └─ .env               # Variables de entorno del backend
└─ web/
   ├─ src/               # Frontend Vue 3 (Vite)
   ├─ vite.config.js     # (Opcional) Proxy para /api -> http://localhost:3001
   └─ .env               # (Opcional) VITE_API_BASE=http://localhost:3001
```

---

## ⚙️ Requisitos

- Node.js 18+
- Cuenta de Stripe (clave secreta **test**)
- Precios creados en el **Dashboard de Stripe** (Products > Prices)

---

## 🔑 Variables de entorno

### `server/.env` (obligatorio)
```dotenv
STRIPE_SECRET_KEY=sk_test_************************
CLIENT_URL=http://localhost:5173
PORT=3001
```

> **Nota:** `CLIENT_URL` debe coincidir con el origen del frontend para CORS y para `success_url`/`cancel_url`.

### `web/.env` (opcional si no usas proxy)
```dotenv
VITE_API_BASE=http://localhost:3001
```

---

## 🛠 Instalación

### Backend
```bash
cd server
npm i
node server.js
# Backend en: http://localhost:3001
```

### Frontend
```bash
cd ../web
npm i
npm run dev
# Frontend en: http://localhost:5173
```

---

## 🔌 Endpoints del backend

- `GET /api/prices`  
  Lista los **Prices** de Stripe. (Opcional: ordenados por `unit_amount`).

- `POST /api/checkout`  
  Crea una sesión de **Stripe Checkout**:
  ```json
  { "priceId": "price_123" }
  ```
  Respuesta:
  ```json
  { "url": "https://checkout.stripe.com/c/session_id" }
  ```

> **Importante:** Tu clave `STRIPE_SECRET_KEY` solo vive en el **backend**.

---

## 🖥 Uso en el Frontend

### Obtener precios
```js
// Ejemplo con proxy (ruta relativa)
const res = await fetch('/api/prices')
const prices = await res.json()
```

### Crear checkout
```js
const res = await fetch('/api/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ priceId })
})
const { url } = await res.json()
window.location.href = url
```

---

## 🔒 CORS en desarrollo (elige una)

1) **Proxy de Vite (recomendado)** – `web/vite.config.js`
```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})
```
Usa rutas relativas (`/api/*`) en el frontend.

2) **CORS en Express**
```js
import cors from 'cors'
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173']
}))
```

---

## ✅ Pruebas con tarjetas de Stripe

En **modo test**, usa:
- **Visa:** `4242 4242 4242 4242`  
  Fecha futura cualquiera, CVC 3 dígitos, ZIP cualquiera.

Más tarjetas de prueba: Dashboard de Stripe → *Developers* → *Testing*.

---

## 🔁 Pagos únicos vs Suscripciones

- **Pago único (actual):**
  ```js
  mode: 'payment'
  ```
- **Suscripción:**
  ```js
  mode: 'subscription'
  ```
  Asegúrate de que tu `price` sea **recurring** en Stripe (mensual, anual, etc.).

---

## 🚀 Despliegue (resumen)

- **Backend**: Render, Railway, Fly, VPS, etc.  
  - Configura variables `STRIPE_SECRET_KEY`, `CLIENT_URL`, `PORT`.
  - Fuerza HTTPS.
- **Frontend**: Vercel, Netlify, Cloudflare Pages, etc.  
  - Ajusta `CLIENT_URL` en el backend para que apunte a tu dominio público.
  - Si usas proxy en dev, en producción llama a la **URL real del backend** (sin proxy).

---

## 🧩 Troubleshooting

- **CORS bloqueado**  
  - Verifica origen: `localhost` vs `127.0.0.1`  
  - Usa proxy de Vite o configura `cors()` en Express.

- **`Failed to fetch`**  
  - Backend caído o puerto distinto. Revisa `node server.js` y la consola.
  - Si tocas `.env`, **reinicia** el backend.

- **`invalid_api_key` / `invalid_token`**  
  - Revisa `STRIPE_SECRET_KEY` test vs live.
  - Usa **keys de test** en desarrollo.

- **No ves precios**  
  - Crea `Products`/`Prices` en Dashboard de Stripe.
  - Confirma que `priceId` que envías existe y es de **modo test**.

---

## 🧪 Scripts sugeridos

En `server/package.json`:
```json
{
  "scripts": {
    "dev": "node server.js"
  }
}
```

En `web/package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## 📄 Licencia

MIT – usa este proyecto como base y mejóralo a tu gusto.
