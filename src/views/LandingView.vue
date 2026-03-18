<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="landing">
    <section class="hero">
      <div class="hero__content">
        <h1 class="hero__title">Salud y sabor en cada bocado</h1>
        <p class="hero__subtitle">
          Filtra y recibe recomendaciones de recetas y alimentos según tu perfil, condición física y
          necesidades de salud.
        </p>

        <div class="hero__actions">
          <RouterLink class="btn btn--primary link" to="/login">Iniciar sesión</RouterLink>
          <RouterLink class="btn btn--secondary link" to="/about">Conoce más</RouterLink>
        </div>
      </div>

      <div class="hero__visual" aria-hidden="true">
        <div class="hero__plate" />
      </div>
    </section>

    <section class="features">
      <h2 class="section-title">Qué puedes hacer</h2>
      <div class="features__grid">
        <article class="feature">
          <header>
            <h3>Personaliza tu perfil</h3>
            <p>Registra tus condiciones físicas, alergias y objetivos para recibir sugerencias enfocadas.</p>
          </header>
        </article>

        <article class="feature">
          <header>
            <h3>Filtra por necesidades</h3>
            <p>
              Escoge filtros como "bajo en sodio", "alto en proteínas" o "sin lácteos" para ver recetas
              que se adapten a ti.
            </p>
          </header>
        </article>

        <article class="feature">
          <header>
            <h3>Recetas inteligentes</h3>
            <p>
              Obtén recomendaciones de alimentos y platos con datos nutricionales y sugerencias para
              cuidar tu bienestar.
            </p>
          </header>
        </article>
      </div>
    </section>

    <section class="palette">
      <h2 class="section-title">Paleta de colores</h2>
      <p class="palette__description">
        Nuestra interfaz está inspirada en alimentos frescos y saludables. Estos colores se usan como
        base para los acentos y llamadas a la acción.
      </p>
      <div class="palette__grid">
        <div class="color-swatch" style="background: var(--palette-honeydew);">
          <span>Honeydew</span>
          <small>#eaf2e3</small>
        </div>
        <div class="color-swatch" style="background: var(--palette-neon-ice);">
          <span>Neon Ice</span>
          <small>#61e8e1</small>
        </div>
        <div class="color-swatch" style="background: var(--palette-vibrant-coral);">
          <span>Vibrant Coral</span>
          <small>#f25757</small>
        </div>
        <div class="color-swatch" style="background: var(--palette-banana-cream);">
          <span>Banana Cream</span>
          <small>#f2e863</small>
        </div>
        <div class="color-swatch" style="background: var(--palette-royal-gold);">
          <span>Royal Gold</span>
          <small>#f2cd60</small>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.landing {
  display: grid;
  gap: 3.5rem;
  padding: 3rem 1rem;
}

.link {
    background-color: black;
    padding: 2rem;
}

.link:hover {
    scale: 1.1;
} 

.hero {
  display: grid;
  gap: 2rem;
  align-items: center;
  justify-items: center;
  padding: 3rem 1rem;
  border-radius: 1.25rem;
  background: radial-gradient(circle at top left, var(--palette-neon-ice), transparent 55%),
    radial-gradient(circle at bottom right, var(--palette-vibrant-coral), transparent 55%),
    var(--palette-honeydew);
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.08);
}

.hero__content {
  max-width: 560px;
  text-align: center;
}

.hero__title {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.5rem);
  line-height: 1.05;
  color: var(--vt-c-black);
}

.hero__subtitle {
  margin: 1.3rem 0 2.4rem;
  font-size: 1.05rem;
  color: rgba(28, 36, 34, 0.82);
  line-height: 1.6;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.hero__visual {
  width: min(480px, 100%);
  aspect-ratio: 1.2;
  position: relative;
  filter: drop-shadow(0 14px 28px rgba(0, 0, 0, 0.15));
}

.hero__plate {
  width: 100%;
  height: 100%;
  border-radius: 2.5rem;
  background: radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.7), transparent 55%),
    radial-gradient(circle at 80% 40%, rgba(255, 255, 255, 0.35), transparent 60%),
    radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.45), transparent 55%),
    linear-gradient(170deg, var(--palette-banana-cream) 0%, var(--palette-royal-gold) 100%);
}

.features {
  display: grid;
  gap: 2.5rem;
}

.section-title {
  margin: 0;
  font-size: 1.6rem;
  color: var(--vt-c-black);
  text-align: center;
}

.features__grid {
  display: grid;
  gap: 1.5rem;
}

.feature {
  padding: 1.8rem 1.5rem;
  border-radius: 1.25rem;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 14px 20px rgba(0, 0, 0, 0.05);
}

.feature h3 {
  margin: 0 0 0.75rem;
  color: var(--vt-c-black);
}

.feature p {
  margin: 0;
  color: rgba(28, 36, 34, 0.75);
  line-height: 1.6;
}

.palette {
  padding: 1.5rem;
  border-radius: 1.25rem;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.palette__description {
  margin: 0.75rem auto 1.5rem;
  max-width: 680px;
  text-align: center;
  color: rgba(28, 36, 34, 0.7);
}

.palette__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
}

.color-swatch {
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.08);
  display: grid;
  gap: 0.25rem;
  justify-items: start;
  color: rgba(0, 0, 0, 0.75);
}

.color-swatch span {
  font-weight: 700;
}

.color-swatch small {
  opacity: 0.8;
}

@media (min-width: 900px) {
  .hero {
    grid-template-columns: 1fr 1fr;
    padding: 4rem 3rem;
    gap: 3.5rem;
  }

  .hero__content {
    text-align: left;
  }

  .features__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
