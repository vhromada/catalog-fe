import AddPictureView from '../views/pictures/AddPictureView.vue';
import PictureListView from '../views/pictures/PictureListView.vue';

export default [
  {
    path: '/pictures',
    name: 'pictures',
    component: PictureListView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/pictures/add',
    name: 'addPicture',
    component: AddPictureView,
    meta: {
      requiresAuth: true
    }
  }
];
