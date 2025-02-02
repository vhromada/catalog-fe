<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import BookMenu from '../BookMenu.vue';

const props = defineProps({
  book: {type: String, required: true}
});
const {t} = useI18n();
</script>

<template>
  <BookMenu/>
  <div class="navbar navbar-expand-lg navbar-light bg-light innerMenu">
    <div class="container-fluid">
      <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#bookItemNavbarCollapse" aria-controls="bookItemNavbarCollapse" aria-expanded="false"
              aria-label="Toggle book item navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="bookItemNavbarCollapse" class="collapse navbar-collapse">
        <ul class="nav navbar-nav">
          <li class="nav-item">
            <router-link id="bookItemListNavigation" class="nav-link" :to="{name: 'bookItems', params: {book: props.book}}">{{ t('bookItems.menu.list') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link id="addBookItemNavigation" class="nav-link" :to="{name: 'addBookItem', params: {book: props.book}}">{{ t('bookItems.form.add') }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
