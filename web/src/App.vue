<template>
  <div>
    <nav style="display:flex; gap:12px; padding:12px; border-bottom:1px solid #eee;">
      <router-link to="/">Home</router-link>
      <router-link to="/pricing">Pricing</router-link>
    </nav>
    <router-view />
  </div>
</template>
