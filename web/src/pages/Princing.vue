<script>
import ButtonCheckout from '../components/Checkout.vue'

export default {
  components: {
    ButtonCheckout
  },
  data() {
    return {
      prices: [],
      loading: true,
      error: null
    }
  },
  async mounted() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/prices`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al obtener precios')
      this.prices = data
    } catch (err) {
      this.error = err.message
    } finally {
      this.loading = false
    }
  }
}
</script>

<template>
  <section style="padding:24px;">
    <h1>Pricing</h1>

    <div v-if="loading">Cargando precios…</div>
    <div v-else-if="error" style="color:red">{{ error }}</div>

    <div v-else style="display:flex; gap:12px; flex-wrap:wrap;">
      <div
        v-for="p in prices"
        :key="p.id"
        style="border:1px solid #ddd; padding:16px; border-radius:8px; min-width:220px;"
      >
        <h3>{{ p.nickname || 'Plan' }}</h3>
        <h2 style="margin:8px 0; font-weight:bold;">
          S/ {{ (p.unit_amount ?? 0) / 100 }}
        </h2>
        <ButtonCheckout :priceId="p.id" />
      </div>
    </div>
  </section>
</template>

