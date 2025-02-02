import { createRouter, createWebHistory, type NavigationGuardNext, type RouteLocationNormalized, type RouteRecordRaw } from 'vue-router';
import { userStore } from '../store/UserStore.ts';
import CatalogView from '../views/CatalogView.vue';
import LoginView from '../views/login/LoginView.vue';
import PageNotFoundView from '../views/PageNotFoundView.vue';
import RegistrationView from '../views/registration/RegistrationView.vue';
import accountsRoutes from './accountsRoutes.ts';
import authorsRoutes from './authorsRoutes.ts';
import booksRoutes from './booksRoutes.ts';
import gamesRoutes from './gamesRoutes.ts';
import genreRoutes from './genresRoutes.ts';
import jokesRoutes from './jokesRoutes.ts';
import moviesRoutes from './moviesRoutes.ts';
import musicRoutes from './musicRoutes.ts';
import picturesRoutes from './picturesRoutes.ts';
import programsRoutes from './programsRoutes.ts';
import showsRoutes from './showsRoutes.ts';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'catalog',
    component: CatalogView,
    meta: {
      requiresAuth: true
    }
  },
  ...moviesRoutes,
  ...showsRoutes,
  ...gamesRoutes,
  ...musicRoutes,
  ...programsRoutes,
  ...authorsRoutes,
  ...booksRoutes,
  ...jokesRoutes,
  ...genreRoutes,
  ...picturesRoutes,
  ...accountsRoutes,
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/registration',
    name: 'registration',
    component: RegistrationView
  },
  {
    path: '/:pathMatch(.*)*',
    component: PageNotFoundView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  if (to.meta?.requiresAuth && !userStore.isLoggedIn()) {
    next({path: '/login'});
  } else if (to.meta?.requiresAdmin && !userStore.isAdmin()) {
    next();
  } else {
    next();
  }
});

export default router;
