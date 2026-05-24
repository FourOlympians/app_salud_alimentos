<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router   = useRouter()
const { login, loading, error } = useAuth()

const email    = ref('')
const password = ref('')
const remember = ref(false)

async function submit() {
  const ok = await login(email.value.trim(), password.value)
  if (ok) {
    router.push({ name: 'landing' })
  }
}
</script>

<template>
  <main class="login">
    <section class="login__card">
      <header class="login__header">
        <h1>Iniciar sesión</h1>
        <p>
          Accede con tu correo y contraseña para obtener recomendaciones de recetas y alimentos
          personalizadas.
        </p>
      </header>

      <form class="login__form" @submit.prevent="submit" autocomplete="off">
        <label>
          <span>Correo electrónico</span>
          <input
            type="email"
            v-model="email"
            placeholder="ejemplo@correo.com"
            required
            autocomplete="email"
            :disabled="loading"
          />
        </label>

        <label>
          <span>Contraseña</span>
          <input
            type="password"
            v-model="password"
            placeholder="••••••••••"
            required
            autocomplete="current-password"
            :disabled="loading"
          />
        </label>

        <label class="login__remember">
          <input type="checkbox" v-model="remember" :disabled="loading" />
          <span>Recuérdame</span>
        </label>

        <!-- Error de Supabase traducido al español -->
        <p v-if="error" class="login__error">⚠ {{ error }}</p>

        <button type="submit" class="btn btn--primary" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          {{ loading ? 'Entrando…' : 'Entrar' }}
        </button>

        <p class="login__helper">
          ¿No tienes cuenta? <router-link to="/">Regresa al inicio</router-link>
        </p>
      </form>
    </section>
  </main>
</template>

<style scoped>
.login {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, rgba(97, 232, 225, 0.25), rgba(242, 232, 99, 0.12));
}

.login__card {
  width: min(480px, 100%);
  padding: 2.5rem;
  border-radius: 1.5rem;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 28px 45px rgba(0, 0, 0, 0.12);
}

.login__header {
  margin-bottom: 1.75rem;
}

.login__header h1 {
  margin: 0 0 0.5rem;
  font-size: 2rem;
  color: rgba(28, 36, 34, 0.9);
}

.login__header p {
  margin: 0;
  font-size: 0.95rem;
  color: rgba(28, 36, 34, 0.7);
  line-height: 1.6;
}

.login__form {
  display: grid;
  gap: 1.25rem;
}

.login__form label {
  display: grid;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  color: rgba(28, 36, 34, 0.85);
}

.login__form input[type='email'],
.login__form input[type='password'] {
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.85rem;
  padding: 0.85rem 1rem;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
}

.login__form input:focus {
  border-color: var(--palette-neon-ice);
  box-shadow: 0 0 0 3px rgba(97, 232, 225, 0.22);
}

.login__form input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.login__remember {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: rgba(28, 36, 34, 0.75);
}

.login__error {
  margin: 0;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  background: rgba(242, 85, 87, 0.12);
  color: rgba(200, 50, 50, 0.95);
  font-size: 0.95rem;
}

.btn--primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.85rem 1.5rem;
  border-radius: 0.85rem;
  background: var(--palette-neon-ice);
  color: rgba(18, 31, 28, 0.9);
  border: none;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
}

.btn--primary:hover:not(:disabled) {
  opacity: 0.88;
  transform: translateY(-1px);
}

.btn--primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.login__helper {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(28, 36, 34, 0.7);
  text-align: center;
}

.login__helper a {
  color: var(--palette-neon-ice);
  font-weight: 600;
}
</style>
