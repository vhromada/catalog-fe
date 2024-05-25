import AddCheatView from '../views/cheats/AddCheatView.vue';
import CheatListView from '../views/cheats/CheatListView.vue';
import EditCheatView from '../views/cheats/EditCheatView.vue';
import AddGameView from '../views/games/AddGameView.vue';
import EditGameView from '../views/games/EditGameView.vue';
import GameDetailView from '../views/games/GameDetailView.vue';
import GameListView from '../views/games/GameListView.vue';

export default [
  {
    path: '/games',
    name: 'games',
    component: GameListView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/games/add',
    name: 'addGame',
    component: AddGameView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/games/:uuid',
    name: 'editGame',
    props: true,
    component: EditGameView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/games/:uuid/detail',
    name: 'gameDetail',
    props: true,
    component: GameDetailView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/games/:game/cheats',
    name: 'cheats',
    props: true,
    component: CheatListView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/games/:game/cheats/add',
    name: 'addCheats',
    props: true,
    component: AddCheatView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/games/:game/cheats/:uuid',
    name: 'editCheats',
    props: true,
    component: EditCheatView,
    meta: {
      requiresAuth: true
    }
  }
];
