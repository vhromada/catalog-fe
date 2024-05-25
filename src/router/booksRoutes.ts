import AddBookView from '../views/books/AddBookView.vue';
import BookDetailView from '../views/books/BookDetailView.vue';
import BookListView from '../views/books/BookListView.vue';
import EditBookView from '../views/books/EditBookView.vue';
import AddBookItemView from '../views/books/items/AddBookItemView.vue';
import BookItemDetailView from '../views/books/items/BookItemDetailView.vue';
import BookItemListView from '../views/books/items/BookItemListView.vue';
import EditBookItemView from '../views/books/items/EditBookItemView.vue';

export default [
  {
    path: '/books',
    name: 'books',
    component: BookListView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/books/add',
    name: 'addBook',
    component: AddBookView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/books/:uuid',
    name: 'editBook',
    props: true,
    component: EditBookView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/books/:uuid/detail',
    name: 'bookDetail',
    props: true,
    component: BookDetailView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/books/:book/items',
    name: 'bookItems',
    props: true,
    component: BookItemListView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/books/:book/items/add',
    name: 'addBookItem',
    props: true,
    component: AddBookItemView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/books/:book/items/:uuid',
    name: 'editBookItem',
    props: true,
    component: EditBookItemView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/books/:book/items/:uuid/detail',
    name: 'bookItemDetail',
    props: true,
    component: BookItemDetailView,
    meta: {
      requiresAuth: true
    }
  }
];
