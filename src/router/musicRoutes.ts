import AddMusicView from '../views/music/AddMusicView.vue';
import EditMusicView from '../views/music/EditMusicView.vue';
import MusicDetailView from '../views/music/MusicDetailView.vue';
import MusicListView from '../views/music/MusicListView.vue';
import AddSongView from '../views/songs/AddSongView.vue';
import EditSongView from '../views/songs/EditSongView.vue';
import SongDetailView from '../views/songs/SongDetailView.vue';
import SongListView from '../views/songs/SongListView.vue';

export default [
  {
    path: '/music',
    name: 'musicList',
    component: MusicListView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/music/add',
    name: 'addMusic',
    component: AddMusicView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/music/:uuid',
    name: 'editMusic',
    props: true,
    component: EditMusicView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/music/:uuid/detail',
    name: 'musicDetail',
    props: true,
    component: MusicDetailView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/music/:music/songs',
    name: 'songs',
    props: true,
    component: SongListView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/music/:music/songs/add',
    name: 'addSong',
    props: true,
    component: AddSongView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/music/:music/songs/:uuid',
    name: 'editSong',
    props: true,
    component: EditSongView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/music/:music/songs/:uuid/detail',
    name: 'songDetail',
    props: true,
    component: SongDetailView,
    meta: {
      requiresAuth: true
    }
  }
];
