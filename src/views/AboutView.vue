<template>
  <main class="about">
    <section class="about__hero">
      <h1>Sobre la aplicación</h1>
      <p>
        Esta herramienta te ayuda a filtrar y recomendar recetas y alimentos pensados para tu salud.
        Toma en cuenta condiciones físicas, alergias y objetivos nutricionales.
      </p>
    </section>

    <section class="about__features">
      <article>
        <h2>Perfiles personalizados</h2>
        <p>
          Crea el perfil de quien cocina: edad, actividad, condiciones médicas y preferencias. A partir de
          ahí verás recetas relevantes para cada situación.
        </p>
      </article>

      <article>
        <h2>Recomendaciones inteligentes</h2>
        <p>
          Gracias a filtros de nutrición, podrás encontrar comidas bajas en sodio, sin gluten,
          altas en proteínas, y más.
        </p>
      </article>

      <article>
        <h2>Fácil de usar</h2>
        <p>
          Navega por recetas, guarda favoritos y ajusta tus objetivos para recibir sugerencias más
          precisas con el tiempo.
        </p>
      </article>
    </section>
  </main>
</template>

<style scoped>
.about {
  padding: 2.5rem 1.5rem;
  display: grid;
  gap: 2.5rem;
  max-width: 960px;
  margin: 0 auto;
}

.about__hero h1 {
  margin: 0;
  font-size: clamp(1.9rem, 4vw, 2.6rem);
  color: rgba(18, 31, 28, 0.92);
}

.about__hero p {
  margin: 1rem 0 0;
  line-height: 1.6;
  color: rgba(18, 31, 28, 0.72);
  max-width: 720px;
}

.about__features {
  display: grid;
  gap: 1.75rem;
}

.about__features article {
  padding: 1.75rem;
  border-radius: 1.25rem;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 16px 28px rgba(0, 0, 0, 0.08);
}

.about__features h2 {
  margin: 0 0 0.75rem;
  color: rgba(18, 31, 28, 0.88);
}

.about__features p {
  margin: 0;
  color: rgba(18, 31, 28, 0.7);
  line-height: 1.6;
}

@media (min-width: 900px) {
  .about__features {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
