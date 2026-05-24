<script setup>
import { onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const { user, initAuth, logout } = useAuth()
const router = useRouter()

// Restaura la sesión al cargar la app (si el usuario ya había iniciado sesión antes)
onMounted(() => {
  initAuth()
})

async function handleLogout() {
  await logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="app_container">
    <header class="app-header">
      <div class="header__brand">
        <img alt="App logo" class="logo" src="@/assets/logo_fresa.png" height="100" />
        <div>
          <h1 class="app-title">FoodLight</h1>
          <p class="app-subtitle">Recetas inteligentes para cada estilo de vida</p>
        </div>
      </div>

      <nav class="app-nav">
        <RouterLink class="link" to="/">Inicio</RouterLink>

        <!-- Muestra el buscador y logout solo si hay sesión activa -->
        <template v-if="user">
          <RouterLink class="link" to="/buscador">Buscador</RouterLink>
          <span class="nav__user">{{ user.email }}</span>
          <button class="btn-logout" @click="handleLogout">Salir</button>
        </template>

        <!-- Si no hay sesión, muestra login -->
        <template v-else>
          <RouterLink class="link" to="/login">Iniciar sesión</RouterLink>
        </template>

        <RouterLink class="link" to="/about">Acerca</RouterLink>
      </nav>
    </header>

    <RouterView />
  </div>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  margin: 0 auto;
  max-width: 1140px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(14px);
}

.header__brand {
  flex-direction: row;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.app-title {
  margin: 0;
  font-size: 1.45rem;
  letter-spacing: -0.02em;
  color: rgba(18, 31, 28, 0.92);
}

.app-subtitle {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: rgba(18, 31, 28, 0.65);
}

.app-nav {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

.app-nav a {
  font-weight: 600;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  color: rgba(18, 31, 28, 0.75);
  transition: background 0.25s, color 0.25s;
}

.app-nav a.router-link-exact-active {
  background: rgba(97, 232, 225, 0.18);
  color: rgba(18, 31, 28, 0.95);
}

.app-nav a:hover {
  background: rgba(97, 232, 225, 0.22);
}

.nav__user {
  font-size: 0.82rem;
  color: rgba(18, 31, 28, 0.5);
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-logout {
  border: 1.5px solid rgba(242, 87, 87, 0.4);
  background: transparent;
  color: rgba(200, 50, 50, 0.85);
  border-radius: 999px;
  padding: 0.35rem 0.9rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover {
  background: rgba(242, 87, 87, 0.1);
  border-color: rgba(242, 87, 87, 0.7);
}

@media (min-width: 1024px) {
  .app-nav {
    gap: 1.5rem;
  }
}
</style>
