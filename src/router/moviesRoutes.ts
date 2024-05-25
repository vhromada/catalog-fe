import AddMovieView from '../views/movies/AddMovieView.vue';
import EditMovieView from '../views/movies/EditMovieView.vue';
import MovieDetailView from '../views/movies/MovieDetailView.vue';
import MovieListView from '../views/movies/MovieListView.vue';

export default [
  {
    path: '/movies',
    name: 'movies',
    component: MovieListView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/movies/add',
    name: 'addMovie',
    component: AddMovieView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/movies/:uuid',
    name: 'editMovie',
    props: true,
    component: EditMovieView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/movies/:uuid/detail',
    name: 'movieDetail',
    props: true,
    component: MovieDetailView,
    meta: {
      requiresAuth: true
    }
  }
];
