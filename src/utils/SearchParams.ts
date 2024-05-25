export default class SearchParams {

  private params = new Map<string, string>();

  add(key: string, value?: any): SearchParams {
    if (value !== undefined) {
      this.params.set(key, value);
    }
    return this;
  }

  build(): string {
    if (this.params.size == 0) {
      return '';
    }
    const result = [];
    for (const param of this.params.entries()) {
      result.push(param[0] + '=' + param[1]);
    }
    return '?' + result.join('&');
  }

}
