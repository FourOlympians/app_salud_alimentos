<template>
  <div class="buscador">

    <!-- ── ENCABEZADO ─────────────────────────────────────── -->
    <header class="buscador__header">
      <h1>Sistema Mexicano de<br><em>Alimentos Equivalentes</em></h1>
      <p class="buscador__subtitulo">5ª Edición · {{ totalAlimentos.toLocaleString() }} alimentos</p>
    </header>

    <!-- ── CONTROLES ──────────────────────────────────────── -->
    <section class="buscador__controles">
      <!-- Búsqueda por nombre -->
      <div class="campo campo--busqueda">
        <span class="campo__icono">⌕</span>
        <input
          v-model="textoBusqueda"
          @input="onInput"
          type="text"
          placeholder="Buscar alimento…"
          class="campo__input"
          maxlength="80"
        />
        <button v-if="textoBusqueda" @click="limpiarBusqueda" class="campo__clear">✕</button>
      </div>

      <!-- Filtro por grupo -->
      <div class="campo campo--grupo">
        <select v-model="grupoSeleccionado" @change="buscar(1)" class="campo__select">
          <option :value="null">Todos los grupos</option>
          <option v-for="g in grupos" :key="g.id" :value="g.id">
            {{ g.nombre }}
          </option>
        </select>
      </div>
    </section>

    <!-- ── CHIPS DE GRUPOS ────────────────────────────────── -->
    <section class="chips" aria-label="Filtrar por grupo">
      <button
        class="chip"
        :class="{ 'chip--activo': grupoSeleccionado === null }"
        @click="seleccionarGrupo(null)"
      >Todos</button>
      <button
        v-for="g in grupos"
        :key="g.id"
        class="chip"
        :class="{ 'chip--activo': grupoSeleccionado === g.id }"
        @click="seleccionarGrupo(g.id)"
      >{{ g.nombre }}</button>
    </section>

    <!-- ── ESTADO ─────────────────────────────────────────── -->
    <div v-if="cargando" class="estado estado--cargando">
      <span class="spinner"></span> Buscando…
    </div>
    <div v-else-if="error" class="estado estado--error">⚠ {{ error }}</div>
    <div v-else-if="alimentos.length === 0 && buscado" class="estado estado--vacio">
      Sin resultados para <strong>{{ textoBusqueda || grupoNombre }}</strong>.
    </div>

    <!-- ── TABLA ──────────────────────────────────────────── -->
    <section v-if="alimentos.length > 0" class="tabla-wrapper">
      <p class="tabla__meta">
        {{ meta.total.toLocaleString() }} resultados
        <span v-if="textoBusqueda"> para "<strong>{{ textoBusqueda }}</strong>"</span>
        <span v-if="grupoNombre"> · {{ grupoNombre }}</span>
      </p>

      <table class="tabla">
        <thead>
          <tr>
            <th>Alimento</th>
            <th>Grupo</th>
            <th>Cantidad</th>
            <th class="num">Energía<br><small>kcal</small></th>
            <th class="num">Proteína<br><small>g</small></th>
            <th class="num">Lípidos<br><small>g</small></th>
            <th class="num">H.C.<br><small>g</small></th>
            <th class="num">Fibra<br><small>g</small></th>
            <th class="num">Sodio<br><small>mg</small></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="a in alimentos"
            :key="a.id"
            @click="abrirDetalle(a)"
            class="tabla__fila"
          >
            <td class="td--nombre">{{ a.nombre }}</td>
            <td class="td--grupo">
              <span class="badge" :class="`badge--${a.grupo_id}`">
                {{ nombreGrupo(a.grupo_id) }}
              </span>
            </td>
            <td>{{ a.cantidad_sugerida }} {{ a.unidad }}</td>
            <td class="num">{{ fmt(a.energia_kcal) }}</td>
            <td class="num">{{ fmt(a.proteina_g) }}</td>
            <td class="num">{{ fmt(a.lipidos_g) }}</td>
            <td class="num">{{ fmt(a.hidratos_carbono_g) }}</td>
            <td class="num">{{ fmt(a.fibra_g) }}</td>
            <td class="num">{{ fmt(a.sodio_mg) }}</td>
            <td><button class="btn-ver">Ver</button></td>
          </tr>
        </tbody>
      </table>

      <!-- Paginación -->
      <nav class="paginacion" aria-label="Paginación">
        <button :disabled="paginaActual <= 1" @click="buscar(paginaActual - 1)" class="pag__btn">‹ Anterior</button>
        <span class="pag__info">Página {{ paginaActual }} de {{ totalPaginas }}</span>
        <button :disabled="paginaActual >= totalPaginas" @click="buscar(paginaActual + 1)" class="pag__btn">Siguiente ›</button>
      </nav>
    </section>

    <!-- ── MODAL DETALLE ──────────────────────────────────── -->
    <Transition name="modal">
      <div v-if="detalle" class="modal-overlay" @click.self="cerrarDetalle">
        <div class="modal" role="dialog" aria-modal="true">
          <button class="modal__cerrar" @click="cerrarDetalle">✕</button>

          <div class="modal__encabezado">
            <span class="badge" :class="`badge--${detalle.grupo_id}`">
              {{ nombreGrupo(detalle.grupo_id) }}
            </span>
            <h2 class="modal__nombre">{{ detalle.nombre }}</h2>
            <p class="modal__medida">{{ detalle.cantidad_sugerida }} {{ detalle.unidad }} · {{ detalle.peso_neto_g }}g neto</p>
          </div>

          <div class="modal__nutrientes">
            <div class="nutr-grid">
              <div class="nutr-card nutr-card--energia">
                <span class="nutr-card__valor">{{ fmt(detalle.energia_kcal) }}</span>
                <span class="nutr-card__label">kcal</span>
              </div>
              <NutrItem label="Proteína" :valor="detalle.proteina_g" unidad="g" />
              <NutrItem label="Lípidos" :valor="detalle.lipidos_g" unidad="g" />
              <NutrItem label="H. de C." :valor="detalle.hidratos_carbono_g" unidad="g" />
              <NutrItem label="Fibra" :valor="detalle.fibra_g" unidad="g" />
              <NutrItem label="Azúcar" :valor="detalle.azucar_g" unidad="g" />
              <NutrItem label="Sodio" :valor="detalle.sodio_mg" unidad="mg" />
              <NutrItem label="Calcio" :valor="detalle.calcio_mg" unidad="mg" />
              <NutrItem label="Hierro" :valor="detalle.hierro_mg" unidad="mg" />
              <NutrItem label="Potasio" :valor="detalle.potasio_mg" unidad="mg" />
              <NutrItem label="Colesterol" :valor="detalle.colesterol_mg" unidad="mg" />
              <NutrItem label="Vit. A" :valor="detalle.vitamina_a_mg_re" unidad="mg RE" />
              <NutrItem label="Vit. C" :valor="detalle.acido_ascorbico_mg" unidad="mg" />
              <NutrItem label="Ac. Fólico" :valor="detalle.acido_folico_mg" unidad="mg" />
              <NutrItem label="AG Sat." :valor="detalle.ag_saturados_g" unidad="g" />
              <NutrItem label="AG Mono." :valor="detalle.ag_monoinsaturados_g" unidad="g" />
              <NutrItem label="AG Poli." :valor="detalle.ag_poliinsaturados_g" unidad="g" />
              <NutrItem v-if="detalle.etanol_g" label="Etanol" :valor="detalle.etanol_g" unidad="g" />
              <NutrItem v-if="detalle.indice_glucemico" label="Índ. Glucémico" :valor="detalle.indice_glucemico" unidad="" />
              <NutrItem v-if="detalle.carga_glucemica" label="Carga Glucém." :valor="detalle.carga_glucemica" unidad="" />
            </div>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getGrupos, getAlimentos, buscarAlimentos } from '@/services/alimentosService'

// ── Sub-componente inline ──────────────────────────────────
const NutrItem = {
  props: ['label', 'valor', 'unidad'],
  template: `
    <div class="nutr-item">
      <span class="nutr-item__label">{{ label }}</span>
      <span class="nutr-item__valor">{{ valor != null ? Number(valor).toFixed(1) : 'ND' }} <small>{{ unidad }}</small></span>
    </div>
  `
}

// ── Estado ─────────────────────────────────────────────────
const grupos            = ref([])
const alimentos         = ref([])
const meta              = ref({ page: 1, page_size: 30, total: 0 })
const cargando          = ref(false)
const error             = ref(null)
const buscado           = ref(false)
const textoBusqueda     = ref('')
const grupoSeleccionado = ref(null)
const paginaActual      = ref(1)
const detalle           = ref(null)
const totalAlimentos    = ref(2867)
let   debounceTimer     = null

// ── Computadas ─────────────────────────────────────────────
const totalPaginas = computed(() =>
  Math.max(1, Math.ceil(meta.value.total / meta.value.page_size))
)

const grupoNombre = computed(() =>
  grupos.value.find(g => g.id === grupoSeleccionado.value)?.nombre ?? ''
)

// ── Helpers ────────────────────────────────────────────────
function fmt(val) {
  if (val == null) return '—'
  return Number(val).toFixed(1)
}

function nombreGrupo(grupo_id) {
  return grupos.value.find(g => g.id === grupo_id)?.nombre ?? '—'
}

// ── Carga inicial ──────────────────────────────────────────
onMounted(async () => {
  try {
    grupos.value = await getGrupos()
    await buscar(1)
  } catch (e) {
    error.value = e.message
  }
})

// ── Acciones ───────────────────────────────────────────────
function onInput() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => buscar(1), 350)
}

function seleccionarGrupo(id) {
  grupoSeleccionado.value = id
  buscar(1)
}

function limpiarBusqueda() {
  textoBusqueda.value = ''
  buscar(1)
}

async function buscar(pagina = 1) {
  cargando.value = true
  error.value    = null
  buscado.value  = true
  paginaActual.value = pagina

  try {
    const params = { grupo_id: grupoSeleccionado.value, page: pagina }
    let resultado

    if (textoBusqueda.value.trim().length >= 2) {
      resultado = await buscarAlimentos({ q: textoBusqueda.value.trim(), ...params })
    } else {
      resultado = await getAlimentos(params)
    }

    alimentos.value = resultado.data
    meta.value      = resultado.meta
  } catch (e) {
    error.value = e.message
    alimentos.value = []
  } finally {
    cargando.value = false
  }
}

function abrirDetalle(alimento) {
  detalle.value = alimento
  document.body.style.overflow = 'hidden'
}

function cerrarDetalle() {
  detalle.value = null
  document.body.style.overflow = ''
}
</script>

<style scoped>
/* ── Variables ─────────────────────────────────────────── */
.buscador {
  --verde:    #2d6a4f;
  --verde-cl: #52b788;
  --crema:    #fefae0;
  --cafe:     #7b4f23;
  --gris:     #f4f3ef;
  --borde:    #d8d5cc;
  --texto:    #1a1a18;
  --sombra:   0 2px 12px rgba(0,0,0,.08);

  font-family: 'Georgia', 'Times New Roman', serif;
  min-height: 100vh;
  background: var(--crema);
  color: var(--texto);
  padding: 0 0 4rem;
}

/* ── Header ─────────────────────────────────────────────── */
.buscador__header {
  background: var(--verde);
  color: #fff;
  padding: 2.5rem 2rem 2rem;
  text-align: center;
}
.buscador__header h1 {
  font-size: clamp(1.5rem, 4vw, 2.4rem);
  font-weight: 400;
  margin: 0 0 .4rem;
  line-height: 1.2;
}
.buscador__header em {
  font-style: italic;
  color: var(--verde-cl);
}
.buscador__subtitulo {
  margin: 0;
  font-size: .95rem;
  opacity: .8;
  font-family: 'Courier New', monospace;
  letter-spacing: .05em;
}

/* ── Controles ──────────────────────────────────────────── */
.buscador__controles {
  display: flex;
  gap: .75rem;
  padding: 1.25rem 1.5rem;
  background: #fff;
  border-bottom: 1px solid var(--borde);
  flex-wrap: wrap;
}

.campo { display: flex; align-items: center; }
.campo--busqueda {
  flex: 1;
  min-width: 220px;
  border: 1.5px solid var(--borde);
  border-radius: 6px;
  background: var(--gris);
  padding: 0 .75rem;
  transition: border-color .2s;
}
.campo--busqueda:focus-within { border-color: var(--verde); }
.campo__icono { font-size: 1.2rem; color: #999; margin-right: .4rem; }
.campo__input {
  flex: 1;
  border: none;
  background: transparent;
  padding: .65rem 0;
  font-size: 1rem;
  font-family: inherit;
  outline: none;
}
.campo__clear {
  background: none; border: none; cursor: pointer;
  color: #999; font-size: .85rem; padding: .2rem;
}
.campo__clear:hover { color: var(--cafe); }

.campo--grupo { min-width: 200px; }
.campo__select {
  width: 100%;
  border: 1.5px solid var(--borde);
  border-radius: 6px;
  background: var(--gris);
  padding: .65rem .9rem;
  font-size: .95rem;
  font-family: inherit;
  cursor: pointer;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right .75rem center;
  padding-right: 2rem;
  transition: border-color .2s;
}
.campo__select:focus { border-color: var(--verde); }

/* ── Chips ──────────────────────────────────────────────── */
.chips {
  display: flex;
  gap: .5rem;
  padding: .75rem 1.5rem;
  overflow-x: auto;
  background: #fff;
  border-bottom: 1px solid var(--borde);
  scrollbar-width: none;
}
.chips::-webkit-scrollbar { display: none; }

.chip {
  white-space: nowrap;
  border: 1.5px solid var(--borde);
  border-radius: 20px;
  padding: .3rem .9rem;
  font-size: .82rem;
  background: var(--gris);
  cursor: pointer;
  transition: all .15s;
  font-family: inherit;
}
.chip:hover { border-color: var(--verde-cl); color: var(--verde); }
.chip--activo {
  background: var(--verde);
  border-color: var(--verde);
  color: #fff;
}

/* ── Estado ─────────────────────────────────────────────── */
.estado {
  padding: 3rem;
  text-align: center;
  font-size: 1.05rem;
}
.estado--cargando { color: var(--verde); }
.estado--error    { color: #c0392b; }
.estado--vacio    { color: #888; }

.spinner {
  display: inline-block;
  width: 1.1em; height: 1.1em;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin .6s linear infinite;
  vertical-align: middle;
  margin-right: .4em;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Tabla ──────────────────────────────────────────────── */
.tabla-wrapper { padding: 1.25rem 1.5rem; overflow-x: auto; }

.tabla__meta {
  font-size: .88rem;
  color: #777;
  margin: 0 0 .75rem;
}

.tabla {
  width: 100%;
  border-collapse: collapse;
  font-size: .9rem;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--sombra);
}
.tabla thead { background: var(--verde); color: #fff; }
.tabla th {
  padding: .75rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: .82rem;
  letter-spacing: .04em;
  text-transform: uppercase;
}
.tabla th.num, .tabla td.num { text-align: right; }

.tabla__fila {
  border-top: 1px solid var(--borde);
  cursor: pointer;
  transition: background .12s;
}
.tabla__fila:hover { background: #f0f7f4; }
.tabla td { padding: .65rem 1rem; vertical-align: middle; }

.td--nombre { font-weight: 500; max-width: 220px; }

/* Badges de grupo */
.badge {
  font-size: .7rem;
  padding: .2rem .55rem;
  border-radius: 12px;
  white-space: nowrap;
  font-weight: 600;
  letter-spacing: .03em;
  background: #e8f5e9;
  color: var(--verde);
}

.btn-ver {
  background: none;
  border: 1.5px solid var(--verde-cl);
  color: var(--verde);
  border-radius: 5px;
  padding: .25rem .65rem;
  font-size: .8rem;
  cursor: pointer;
  transition: all .15s;
  font-family: inherit;
}
.btn-ver:hover { background: var(--verde); color: #fff; }

/* ── Paginación ─────────────────────────────────────────── */
.paginacion {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1.5rem;
}
.pag__btn {
  border: 1.5px solid var(--borde);
  background: #fff;
  border-radius: 6px;
  padding: .5rem 1.1rem;
  font-size: .9rem;
  cursor: pointer;
  font-family: inherit;
  transition: all .15s;
}
.pag__btn:hover:not(:disabled) { background: var(--verde); color: #fff; border-color: var(--verde); }
.pag__btn:disabled { opacity: .35; cursor: default; }
.pag__info { font-size: .9rem; color: #888; }

/* ── Modal ──────────────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

.modal {
  background: #fff;
  border-radius: 12px;
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,.25);
  position: relative;
}

.modal__cerrar {
  position: absolute;
  top: 1rem; right: 1rem;
  background: var(--gris);
  border: none;
  border-radius: 50%;
  width: 2rem; height: 2rem;
  font-size: 1rem;
  cursor: pointer;
  line-height: 1;
  transition: background .15s;
}
.modal__cerrar:hover { background: #e0ddd5; }

.modal__encabezado {
  padding: 1.75rem 1.75rem 1rem;
  border-bottom: 1px solid var(--borde);
}
.modal__nombre {
  font-size: 1.4rem;
  font-weight: 600;
  margin: .5rem 0 .3rem;
  line-height: 1.2;
}
.modal__medida { font-size: .9rem; color: #888; margin: 0; }

.modal__nutrientes { padding: 1.25rem 1.75rem 1.75rem; }

.nutr-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: .75rem;
  margin-top: .5rem;
}

.nutr-card--energia {
  grid-column: 1 / -1;
  background: var(--verde);
  color: #fff;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.nutr-card__valor { font-size: 2rem; font-weight: 700; }
.nutr-card__label { font-size: .85rem; opacity: .85; margin-top: -.2rem; }

.nutr-item {
  background: var(--gris);
  border-radius: 8px;
  padding: .65rem .8rem;
  display: flex;
  flex-direction: column;
}
.nutr-item__label { font-size: .72rem; color: #888; text-transform: uppercase; letter-spacing: .04em; }
.nutr-item__valor { font-size: 1rem; font-weight: 600; color: var(--texto); margin-top: .1rem; }
.nutr-item__valor small { font-weight: 400; font-size: .72rem; color: #999; }

/* ── Transición modal ───────────────────────────────────── */
.modal-enter-active, .modal-leave-active { transition: opacity .2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal, .modal-leave-active .modal { transition: transform .2s; }
.modal-enter-from .modal { transform: translateY(20px); }
.modal-leave-to .modal   { transform: translateY(20px); }

/* ── Responsive ─────────────────────────────────────────── */
@media (max-width: 600px) {
  .buscador__controles { padding: .75rem 1rem; }
  .chips { padding: .6rem 1rem; }
  .tabla-wrapper { padding: 1rem; }
  .tabla th, .tabla td { padding: .55rem .65rem; }
  .modal { border-radius: 12px 12px 0 0; margin-top: auto; max-height: 85vh; }
  .modal-overlay { align-items: flex-end; }
}
</style>