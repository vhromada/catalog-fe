import AddJokeView from '../views/jokes/AddJokeView.vue';
import EditJokeView from '../views/jokes/EditJokeView.vue';
import JokeDetailView from '../views/jokes/JokeDetailView.vue';
import JokeListView from '../views/jokes/JokeListView.vue';

export default [
  {
    path: '/jokes',
    name: 'jokes',
    component: JokeListView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/jokes/add',
    name: 'addJoke',
    component: AddJokeView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/jokes/:uuid',
    name: 'editJoke',
    props: true,
    component: EditJokeView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/jokes/:uuid/detail',
    name: 'jokeDetail',
    props: true,
    component: JokeDetailView,
    meta: {
      requiresAuth: true
    }
  },
];
