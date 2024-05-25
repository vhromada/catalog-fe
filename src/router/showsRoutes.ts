import AddEpisodeView from '../views/episodes/AddEpisodeView.vue';
import EditEpisodeView from '../views/episodes/EditEpisodeView.vue';
import EpisodeDetailView from '../views/episodes/EpisodeDetailView.vue';
import EpisodeListView from '../views/episodes/EpisodeListView.vue';
import AddSeasonView from '../views/seasons/AddSeasonView.vue';
import EditSeasonView from '../views/seasons/EditSeasonView.vue';
import SeasonDetailView from '../views/seasons/SeasonDetailView.vue';
import SeasonListView from '../views/seasons/SeasonListView.vue';
import AddShowView from '../views/shows/AddShowView.vue';
import EditShowView from '../views/shows/EditShowView.vue';
import ShowDetailView from '../views/shows/ShowDetailView.vue';
import ShowListView from '../views/shows/ShowListView.vue';

export default [
  {
    path: '/shows',
    name: 'shows',
    component: ShowListView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/shows/add',
    name: 'addShow',
    component: AddShowView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/shows/:uuid',
    name: 'editShow',
    props: true,
    component: EditShowView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/shows/:uuid/detail',
    name: 'showDetail',
    props: true,
    component: ShowDetailView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/shows/:show/seasons',
    name: 'seasons',
    props: true,
    component: SeasonListView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/shows/:show/seasons/add',
    name: 'addSeason',
    props: true,
    component: AddSeasonView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/shows/:show/seasons/:uuid',
    name: 'editSeason',
    props: true,
    component: EditSeasonView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/shows/:show/seasons/:uuid/detail',
    name: 'seasonDetail',
    props: true,
    component: SeasonDetailView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/shows/:show/seasons/:season/episodes',
    name: 'episodes',
    props: true,
    component: EpisodeListView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/shows/:show/seasons/:season/episodes/add',
    name: 'addEpisode',
    props: true,
    component: AddEpisodeView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/shows/:show/seasons/:season/episodes/:uuid',
    name: 'editEpisode',
    props: true,
    component: EditEpisodeView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/shows/:show/seasons/:season/episodes/:uuid/detail',
    name: 'episodeDetail',
    props: true,
    component: EpisodeDetailView,
    meta: {
      requiresAuth: true
    }
  }
];
