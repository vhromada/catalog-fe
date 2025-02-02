import { ref, type Ref } from 'vue';
import registerConnector from '../connector/RegisterConnector.ts';
import roleConnector from '../connector/RoleConnector.ts';
import { type IResult, Result } from '../model/common/Result.ts';

export class RegisterStore {

  programFormats: Ref<string[]>;
  bookItemFormats: Ref<string[]>;
  languages: Ref<string[]>;
  subtitles: Ref<string[]>;
  roles: Ref<string[]>;

  constructor() {
    this.programFormats = ref([]);
    this.bookItemFormats = ref([]);
    this.languages = ref([]);
    this.subtitles = ref([]);
    this.roles = ref([]);
  }

  async loadProgramFormats(): Promise<IResult> {
    if (this.programFormats.value.length == 0) {
      const response = await registerConnector.getProgramFormats();
      if (response.isOk()) {
        this.programFormats.value = response.data!;
      }
      return response;
    } else {
      return Promise.resolve(new Result('loadProgramFormats'));
    }
  }

  async loadBookItemFormats(): Promise<IResult> {
    if (this.bookItemFormats.value.length == 0) {
      const response = await registerConnector.getBookItemFormats();
      if (response.isOk()) {
        this.bookItemFormats.value = response.data!;
      }
      return response;
    } else {
      return Promise.resolve(new Result('loadBookItemFormats'));
    }
  }

  async loadLanguages(): Promise<IResult> {
    if (this.languages.value.length == 0) {
      const response = await registerConnector.getLanguages();
      if (response.isOk()) {
        this.languages.value = response.data!;
      }
      return response;
    } else {
      return Promise.resolve(new Result('loadLanguages'));
    }
  }

  async loadSubtitles(): Promise<IResult> {
    if (this.subtitles.value.length == 0) {
      const response = await registerConnector.getSubtitles();
      if (response.isOk()) {
        this.subtitles.value = response.data!;
      }
      return response;
    } else {
      return Promise.resolve(new Result('loadSubtitles'));
    }
  }

  async loadRoles(): Promise<IResult> {
    if (this.roles.value.length == 0) {
      const response = await roleConnector.getRoles();
      if (response.isOk()) {
        this.roles.value = response.data!;
      }
      return response;
    } else {
      return Promise.resolve(new Result('loadRoles'));
    }
  }

}

export default new RegisterStore();
