<script setup lang="ts">
import AccountSearchForm from '../../components/accounts/AccountSearchForm.vue';
import CatalogMenu from '../../components/CatalogMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { AccountStore } from '../../store/AccountStore.ts';

const store = new AccountStore();

store.load();

async function search(username: string) {
  await store.search(username);
}

async function first() {
  await store.first();
}

async function previous() {
  await store.previous();
}

async function next() {
  await store.next();
}

async function last() {
  await store.last();
}
</script>

<template>
  <CatalogMenu/>
  <div class="container-fluid">
    <h2>{{ $t('accounts.title') }}</h2>
    <AccountSearchForm @search="search"/>
    <div class="table-responsive" v-if="store.exists()">
      <table id="accounts" class="table table-hover" aria-describedby="List of accounts">
        <thead>
          <tr>
            <th data-nav="username">{{ $t('accounts.items.username') }}</th>
            <th data-nav="roles">{{ $t('accounts.items.roles') }}</th>
            <th data-nav="edit"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="account in store.accounts.value" :key="account.uuid">
            <td data-nav="username">{{ account.username }}</td>
            <td data-nav="roles">{{ account.roles.map(role => $t(`registers.${role}`)).join(', ') }}</td>
            <td data-nav="edit">
              <router-link :to="{name: 'editRoles', params: {uuid: account.uuid}}">{{ $t('accounts.form.editRoles') }}</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <nav aria-label="Accounts pagination" v-if="store.isPagingAllowed()">
      <ul class="pagination justify-content-center">
        <li class="page-item" v-if="store.canPrevious()">
          <a id="first" href="#" class="page-link" aria-label="First" @click="first()">&laquo;&laquo;</a>
        </li>
        <li class="page-item" v-if="store.canPrevious()">
          <a id="previous" href="#" class="page-link" aria-label="Previous" @click="previous()">&laquo;</a>
        </li>
        <li class="page-item">
          <a id="pageInfo" href="#" class="page-link disabled">{{ store.getPage() }}</a>
        </li>
        <li class="page-item" v-if="store.canNext()">
          <a id="next" href="#" class="page-link" aria-label="Next" @click="next()">&raquo;</a>
        </li>
        <li class="page-item" v-if="store.canNext()">
          <a id="last" href="#" class="page-link" aria-label="Last" @click="last()">&raquo;&raquo;</a>
        </li>
      </ul>
    </nav>
    <div class="table-responsive">
      <table id="statistics" class="table" aria-describedby="Statistics for accounts">
        <thead>
          <tr>
            <th data-nav="count">{{ $t('accounts.statistics.count') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-nav="count">{{ store.statistics.value.count }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <ResultError/>
</template>
