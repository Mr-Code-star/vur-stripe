<script>
export default {
  props: {
    priceId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async handleCheckout() {
      try {
        this.loading = true
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/checkout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ priceId: this.priceId })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Checkout failed')

        window.location.href = data.url
      } catch (err) {
        alert(err.message)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<template>
  <button :disabled="loading" @click="handleCheckout">
    {{ loading ? 'Redirigiendo…' : 'Comprar' }}
  </button>
</template>