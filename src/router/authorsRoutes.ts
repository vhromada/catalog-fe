import AddAuthorView from '../views/authors/AddAuthorView.vue';
import AuthorListView from '../views/authors/AuthorListView.vue';
import EditAuthorView from '../views/authors/EditAuthorView.vue';

export default [
  {
    path: '/authors',
    name: 'authors',
    component: AuthorListView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/authors/add',
    name: 'addAuthor',
    component: AddAuthorView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/authors/:uuid',
    name: 'editAuthor',
    props: true,
    component: EditAuthorView,
    meta: {
      requiresAuth: true
    }
  }
];
