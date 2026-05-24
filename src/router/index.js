import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import LoginView from '../views/LoginView.vue'
import { supabase } from '@/composables/useAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { onlyGuest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { onlyGuest: true },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/buscador',
      name: 'buscador',
      component: () => import('../views/BuscadorAlimentos.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach(async (to) => {
  const { data } = await supabase.auth.getSession()
  const isLoggedIn = !!data?.session?.user

  if (to.meta.requiresAuth && !isLoggedIn) return { name: 'login' }
  if (to.meta.onlyGuest && isLoggedIn) return { name: 'landing' }
})

export default router