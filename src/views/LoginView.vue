<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const remember = ref(false)
const error = ref('')

const submit = () => {
  error.value = ''

  if (!email.value.trim() || !password.value.trim()) {
    error.value = 'Por favor completa todos los campos para continuar.'
    return
  }

  // Aquí iría la lógica de autenticación real.
  // Por ahora, simulamos un inicio de sesión exitoso.

  router.push({ name: 'landing' })
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
          />
        </label>

        <label class="login__remember">
          <input type="checkbox" v-model="remember" />
          <span>Recuérdame</span>
        </label>

        <p v-if="error" class="login__error">{{ error }}</p>

        <button type="submit" class="btn btn--primary">Entrar</button>

        <p class="login__helper">
          ¿No tienes cuenta? <router-link to="/">Regresa al landing</router-link>
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
  color: rgba(242, 87, 87, 0.95);
  font-size: 0.95rem;
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
