import AddProgramView from '../views/programs/AddProgramView.vue';
import EditProgramView from '../views/programs/EditProgramView.vue';
import ProgramDetailView from '../views/programs/ProgramDetailView.vue';
import ProgramListView from '../views/programs/ProgramListView.vue';

export default [

  {
    path: '/programs',
    name: 'programs',
    component: ProgramListView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/programs/add',
    name: 'addProgram',
    component: AddProgramView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/programs/:uuid',
    name: 'editProgram',
    props: true,
    component: EditProgramView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/programs/:uuid/detail',
    name: 'programDetail',
    props: true,
    component: ProgramDetailView,
    meta: {
      requiresAuth: true
    }
  }
];
