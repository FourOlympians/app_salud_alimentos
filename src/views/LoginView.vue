<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login, loading, error } = useAuth()

const email    = ref('')
const password = ref('')

async function submit() {
  const ok = await login(email.value.trim(), password.value)
  if (ok) router.push({ name: 'landing' })
}
</script>

<template>
  <div class="auth-shell">
    <div class="auth-image">
      <img src="@/assets/logologin.png" alt="FoodLight" />
      <div class="auth-image__overlay">
        <p class="auth-image__tagline">Salud y sabor<br>en cada bocado</p>
      </div>
    </div>

    <div class="auth-panel">
      <div class="auth-form-wrap">
        <header class="auth-header">
          <h1>Iniciar sesión</h1>
          <p>Accede con tu cuenta para ver tus recomendaciones personalizadas.</p>
        </header>

        <form @submit.prevent="submit" autocomplete="off" class="auth-form">
          <div class="field">
            <label for="email">Correo electrónico</label>
            <div class="field__input-wrap">
              <span class="field__icon">✉</span>
              <input
                id="email"
                type="email"
                v-model="email"
                placeholder="ejemplo@correo.com"
                required
                autocomplete="email"
                :disabled="loading"
              />
            </div>
          </div>

          <div class="field">
            <label for="password">Contraseña</label>
            <div class="field__input-wrap">
              <span class="field__icon">🔒</span>
              <input
                id="password"
                type="password"
                v-model="password"
                placeholder="••••••••••"
                required
                autocomplete="current-password"
                :disabled="loading"
              />
            </div>
          </div>

          <p v-if="error" class="auth-error">⚠ {{ error }}</p>

          <button type="submit" class="btn-submit" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? 'Entrando…' : 'INICIAR SESIÓN' }}
          </button>
        </form>

        <p class="auth-switch">
          ¿No tienes cuenta?
          <router-link to="/register">Crear cuenta</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-shell {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
}

.auth-image {
  position: relative;
  overflow: hidden;
}

.auth-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.auth-image__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(15,110,86,0.25) 0%, rgba(4,52,44,0.72) 100%);
  display: flex;
  align-items: flex-end;
  padding: 2.5rem;
}

.auth-image__tagline {
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
  margin: 0;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 12px rgba(0,0,0,0.4);
}

.auth-panel {
  background: #1a2620;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
}

.auth-form-wrap {
  width: 100%;
  max-width: 380px;
}

.auth-header { margin-bottom: 2rem; }

.auth-header h1 {
  font-size: 1.9rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.5rem;
  letter-spacing: -0.02em;
}

.auth-header p {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.55);
  margin: 0;
  line-height: 1.5;
}

.auth-form { display: grid; gap: 1.1rem; }

.field { display: grid; gap: 0.45rem; }

.field label {
  font-size: 0.82rem;
  font-weight: 600;
  color: rgba(255,255,255,0.65);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.field__input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.field__icon {
  position: absolute;
  left: 0.9rem;
  font-size: 0.95rem;
  pointer-events: none;
  opacity: 0.5;
}

.field__input-wrap input {
  width: 100%;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  padding: 0.78rem 0.9rem 0.78rem 2.6rem;
  font-size: 0.95rem;
  color: #fff;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
}

.field__input-wrap input::placeholder { color: rgba(255,255,255,0.25); }

.field__input-wrap input:focus {
  border-color: #52b788;
  background: rgba(82,183,136,0.08);
}

.field__input-wrap input:disabled { opacity: 0.45; cursor: not-allowed; }

.auth-error {
  font-size: 0.88rem;
  color: #f4a9a9;
  background: rgba(242,87,87,0.12);
  border: 1px solid rgba(242,87,87,0.25);
  border-radius: 8px;
  padding: 0.65rem 0.9rem;
  margin: 0;
}

.btn-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.85rem;
  border-radius: 8px;
  background: #52b788;
  color: #0d2118;
  border: none;
  font-size: 0.88rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s, transform 0.15s;
}

.btn-submit:hover:not(:disabled) { background: #3da372; transform: translateY(-1px); }
.btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

.spinner {
  display: inline-block;
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.auth-switch {
  margin-top: 1.75rem;
  font-size: 0.88rem;
  color: rgba(255,255,255,0.45);
  text-align: center;
}

.auth-switch a { color: #52b788; font-weight: 600; text-decoration: none; transition: color 0.2s; }
.auth-switch a:hover { color: #97c459; }

@media (max-width: 700px) {
  .auth-shell { grid-template-columns: 1fr; }
  .auth-image { display: none; }
  .auth-panel { padding: 2.5rem 1.5rem; min-height: 100vh; }
}
</style>