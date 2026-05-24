// src/services/alimentosService.js
// -----------------------------------------------------------
// Servicio centralizado para consumir la API de alimentos.
// Todos los nombres de campo coinciden exactamente con la BD.
// -----------------------------------------------------------

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

/**
 * Hace fetch a la API y lanza error si la respuesta no es ok.
 * @param {string} path
 * @returns {Promise<{data: any, meta?: any}>}
 */
async function apiFetch(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  const json = await res.json();
  if (!json.ok) throw new Error(json.error ?? "Error desconocido");
  return json;
}

// ── Grupos ────────────────────────────────────────────────────

/**
 * Obtiene todos los grupos de alimentos.
 * @returns {Promise<Array<{id: number, nombre: string}>>}
 */
export async function getGrupos() {
  const { data } = await apiFetch("/grupos");
  return data;
}

// ── Alimentos ─────────────────────────────────────────────────

/**
 * Lista alimentos paginados, con filtro de grupo opcional.
 * @param {{ grupo_id?: number, page?: number }} params
 * @returns {Promise<{data: Alimento[], meta: Meta}>}
 */
export async function getAlimentos({ grupo_id = null, page = 1 } = {}) {
  const qs = new URLSearchParams();
  if (grupo_id) qs.set("grupo_id", grupo_id);
  if (page > 1) qs.set("page", page);
  const query = qs.toString() ? `?${qs}` : "";
  return apiFetch(`/alimentos${query}`);
}

/**
 * Busca alimentos por nombre, con filtro de grupo opcional.
 * @param {{ q: string, grupo_id?: number, page?: number }} params
 * @returns {Promise<{data: Alimento[], meta: Meta}>}
 */
export async function buscarAlimentos({ q, grupo_id = null, page = 1 } = {}) {
  const qs = new URLSearchParams({ q });
  if (grupo_id) qs.set("grupo_id", grupo_id);
  if (page > 1) qs.set("page", page);
  return apiFetch(`/alimentos/buscar?${qs}`);
}

/**
 * Obtiene el detalle de un alimento por ID.
 * @param {number} id
 * @returns {Promise<Alimento>}
 */
export async function getAlimento(id) {
  const { data } = await apiFetch(`/alimentos/${id}`);
  return data;
}

// ── JSDoc tipos ───────────────────────────────────────────────
/**
 * @typedef {Object} Alimento
 * @property {number}  id
 * @property {number}  grupo_id
 * @property {string}  nombre
 * @property {string}  cantidad_sugerida
 * @property {string}  unidad
 * @property {number}  peso_bruto_g
 * @property {number}  peso_neto_g
 * @property {number}  energia_kcal
 * @property {number}  proteina_g
 * @property {number}  lipidos_g
 * @property {number}  hidratos_carbono_g
 * @property {number}  ag_saturados_g
 * @property {number}  ag_monoinsaturados_g
 * @property {number}  ag_poliinsaturados_g
 * @property {number}  colesterol_mg
 * @property {number}  azucar_g
 * @property {number}  fibra_g
 * @property {number}  vitamina_a_mg_re
 * @property {number}  acido_ascorbico_mg
 * @property {number}  acido_folico_mg
 * @property {number}  calcio_mg
 * @property {number}  hierro_mg
 * @property {number}  potasio_mg
 * @property {number}  sodio_mg
 * @property {number}  fosforo_mg
 * @property {number}  etanol_g
 * @property {number|null}  indice_glucemico
 * @property {number|null}  carga_glucemica
 */

/**
 * @typedef {Object} Meta
 * @property {number} page
 * @property {number} page_size
 * @property {number} total
 */