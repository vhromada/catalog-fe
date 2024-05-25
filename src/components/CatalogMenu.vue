<script setup lang="ts">
import { useRouter } from 'vue-router';
import { userStore } from '../store/UserStore.ts';

const router = useRouter();

function onLogout() {
  userStore.logout();
  router.push({name: 'login'});
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link id="catalogNavigation" to="/" class="navbar-brand">{{ $t('app.title') }}</router-link>
      <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false"
              aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="navbarCollapse" class="collapse navbar-collapse">
        <ul class="nav navbar-nav">
          <li class="nav-item" v-if="userStore.isAdmin() || userStore.isUser()">
            <router-link id="moviesNavigation" class="nav-link" :to="{name: 'movies'}">{{ $t('movies.title') }}</router-link>
          </li>
          <li class="nav-item" v-if="userStore.isAdmin() || userStore.isUser()">
            <router-link id="showsNavigation" class="nav-link" :to="{name: 'shows'}">{{ $t('shows.title') }}</router-link>
          </li>
          <li class="nav-item" v-if="userStore.isAdmin() || userStore.isUser()">
            <router-link id="gamesNavigation" class="nav-link" :to="{name: 'games'}">{{ $t('games.title') }}</router-link>
          </li>
          <li class="nav-item" v-if="userStore.isAdmin() || userStore.isUser()">
            <router-link id="musicNavigation" class="nav-link" :to="{name: 'musicList'}">{{ $t('music.title') }}</router-link>
          </li>
          <li class="nav-item" v-if="userStore.isAdmin() || userStore.isUser()">
            <router-link id="programsNavigation" class="nav-link" :to="{name: 'programs'}">{{ $t('programs.title') }}</router-link>
          </li>
          <li class="nav-item" v-if="userStore.isAdmin() || userStore.isUser()">
            <router-link id="authorsNavigation" class="nav-link" :to="{name: 'authors'}">{{ $t('authors.title') }}</router-link>
          </li>
          <li class="nav-item" v-if="userStore.isAdmin() || userStore.isUser()">
            <router-link id="booksNavigation" class="nav-link" :to="{name: 'books'}">{{ $t('books.title') }}</router-link>
          </li>
          <li class="nav-item" v-if="userStore.isAdmin() || userStore.isUser()">
            <router-link id="jokesNavigation" class="nav-link" :to="{name: 'jokes'}">{{ $t('jokes.title') }}</router-link>
          </li>
          <li class="nav-item" v-if="userStore.isAdmin() || userStore.isUser()">
            <router-link id="genresNavigation" class="nav-link" :to="{name: 'genres'}">{{ $t('genres.title') }}</router-link>
          </li>
          <li class="nav-item" v-if="userStore.isAdmin() || userStore.isUser()">
            <router-link id="picturesNavigation" class="nav-link" :to="{name: 'pictures'}">{{ $t('pictures.title') }}</router-link>
          </li>
          <li class="nav-item" v-if="userStore.isAdmin()">
            <router-link id="accountsNavigation" class="nav-link" :to="{name: 'accounts'}">{{ $t('accounts.title') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link id="editAccountNavigation" class="nav-link" :to="{name: 'editAccount'}">{{ $t('accounts.form.edit') }}</router-link>
          </li>
          <li class="nav-item">
            <a id="logout" href="#" class="nav-link" @click="onLogout">{{ $t('links.logout') }}</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
