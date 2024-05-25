import AddGenreView from '../views/genres/AddGenreView.vue';
import EditGenreView from '../views/genres/EditGenreView.vue';
import GenreListView from '../views/genres/GenreListView.vue';

export default [
  {
    path: '/genres',
    name: 'genres',
    component: GenreListView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/genres/add',
    name: 'addGenre',
    component: AddGenreView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/genres/:uuid',
    name: 'editGenre',
    props: true,
    component: EditGenreView,
    meta: {
      requiresAuth: true
    }
  }
];
