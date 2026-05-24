/**
 * useApi.js
 * Composable Vue 3 para consumir la API Laravel de FoodLight.
 * Copia este archivo a src/composables/useApi.js en tu proyecto Vue.
 */

import { ref } from 'vue'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'

async function apiFetch(path, options = {}) {
  const { data: sessionData } = await supabase.auth.getSession()
  const token = sessionData?.session?.access_token

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error ?? `HTTP ${res.status}`)
  }

  return res.json()
}

export function useApi() {
  const loading = ref(false)
  const error   = ref(null)

  async function run(fn) {
    loading.value = true
    error.value   = null
    try {
      return await fn()
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  function getAlimentos(params = {}) {
    const qs = new URLSearchParams(params).toString()
    return run(() => apiFetch(`/alimentos?${qs}`))
  }

  function getSemaforo(params = {}) {
    const qs = new URLSearchParams(params).toString()
    return run(() => apiFetch(`/alimentos/semaforo?${qs}`))
  }

  function getAlimento(id) {
    return run(() => apiFetch(`/alimentos/${id}`))
  }

  function getGrupos() {
    return run(() => apiFetch('/grupos'))
  }

  function getCondiciones() {
    return run(() => apiFetch('/condiciones'))
  }

  function getRecetas(params = {}) {
    const qs = new URLSearchParams(params).toString()
    return run(() => apiFetch(`/recetas?${qs}`))
  }

  function getReceta(id) {
    return run(() => apiFetch(`/recetas/${id}`))
  }

  function getRecetasParaMi(params = {}) {
    const qs = new URLSearchParams(params).toString()
    return run(() => apiFetch(`/recetas/para-mi?${qs}`))
  }

  function getPerfil() {
    return run(() => apiFetch('/perfil'))
  }

  function updatePerfil(data) {
    return run(() => apiFetch('/perfil', { method: 'PUT', body: JSON.stringify(data) }))
  }

  function syncCondiciones(condicionIds) {
    return run(() => apiFetch('/perfil/condiciones', {
      method: 'POST',
      body: JSON.stringify({ condicion_ids: condicionIds }),
    }))
  }

  function healthCheck() {
    return run(() => apiFetch('/health'))
  }

  return {
    loading,
    error,
    getAlimentos,
    getSemaforo,
    getAlimento,
    getGrupos,
    getCondiciones,
    getRecetas,
    getReceta,
    getRecetasParaMi,
    getPerfil,
    updatePerfil,
    syncCondiciones,
    healthCheck,
  }
}
