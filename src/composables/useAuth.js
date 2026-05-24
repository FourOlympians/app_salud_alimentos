/**
 * useAuth.js
 * ─────────────────────────────────────────────────────────────
 * Composable para manejar autenticación con Supabase Auth.
 *
 * Expone:
 *   user        → ref con el usuario actual (null si no hay sesión)
 *   loading     → ref boolean mientras carga
 *   error       → ref con el mensaje de error o null
 *   login()     → inicia sesión con email + password
 *   logout()    → cierra sesión
 *   initAuth()  → llama esto una vez en App.vue (onMounted)
 * ─────────────────────────────────────────────────────────────
 */

import { ref } from 'vue'
import { createClient } from '@supabase/supabase-js'

// Cliente Supabase — singleton compartido en todo el composable
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// Estado global de la sesión (compartido entre llamadas al composable)
const user    = ref(null)
const loading = ref(false)
const error   = ref(null)

export function useAuth() {
  /**
   * Sincroniza el estado interno con la sesión actual de Supabase.
   * Llama esto una vez al montar App.vue para restaurar sesiones previas.
   */
  async function initAuth() {
    const { data } = await supabase.auth.getSession()
    user.value = data?.session?.user ?? null

    // Escucha cambios de sesión (login, logout, token refresh)
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
    })
  }

  /**
   * Inicia sesión con email y contraseña.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<boolean>} true si fue exitoso
   */
  async function login(email, password) {
    loading.value = true
    error.value   = null

    try {
      const { data, error: sbError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (sbError) throw sbError

      user.value = data.user
      return true
    } catch (e) {
      // Traduce los mensajes más comunes al español
      error.value = traducirError(e.message)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Cierra la sesión del usuario.
   */
  async function logout() {
    loading.value = true
    error.value   = null
    try {
      await supabase.auth.signOut()
      user.value = null
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    initAuth,
    login,
    logout,
  }
}

// ── Helpers ────────────────────────────────────────────────────

function traducirError(msg = '') {
  if (msg.includes('Invalid login credentials'))
    return 'Correo o contraseña incorrectos.'
  if (msg.includes('Email not confirmed'))
    return 'Confirma tu correo antes de iniciar sesión.'
  if (msg.includes('Too many requests'))
    return 'Demasiados intentos. Espera unos minutos.'
  if (msg.includes('User not found'))
    return 'No existe una cuenta con ese correo.'
  return msg
}
