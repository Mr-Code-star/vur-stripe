
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

- Node.js
- Cuenta de Stripe (clave secreta **test**)
- Precios creados en el **Dashboard de Stripe** (Products > Prices)

---

## 🔑 Variables de entorno

### `server/.env` (obligatorio)
```dotenv
STRIPE_SECRET_KEY=sk_test_************************
CLIENT_URL=http://localhost:5173
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
 const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/prices`)
 const data = await res.json()
 if (!res.ok) throw new Error(data.error || 'Error al obtener precios')
 this.prices = data
```

### Crear checkout
```js
const res = await fetch('/api/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ priceId })
})
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Checkout failed')
  window.location.href = data.url
```

---

## ✅ Pruebas con tarjetas de Stripe

En **modo test**, usa:
- **Visa:** `4242 4242 4242 4242`  
  Fecha futura cualquiera, CVC 3 dígitos, ZIP cualquiera.

Más tarjetas de prueba: [Stripe Cards](https://docs.stripe.com/testing)

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
  - Configura variables `STRIPE_SECRET_KEY`, `CLIENT_URL`.
  - Fuerza HTTPS.
- **Frontend**: Vercel, Netlify, Cloudflare Pages, etc.  
  - Ajusta `CLIENT_URL` en el backend para que apunte a tu dominio público.
  - Si usas proxy en dev, en producción llama a la **URL real del backend** (sin proxy).

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
