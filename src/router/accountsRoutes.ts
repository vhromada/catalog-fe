import AccountListView from '../views/accounts/AccountListView.vue';
import EditAccountView from '../views/accounts/EditAccountView.vue';
import EditRoleView from '../views/roles/EditRoleView.vue';

export default [
  {
    path: '/accounts',
    name: 'accounts',
    component: AccountListView,
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/accounts/edit',
    name: 'editAccount',
    component: EditAccountView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/accounts/:uuid/roles',
    name: 'editRoles',
    props: true,
    component: EditRoleView,
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  }
];
