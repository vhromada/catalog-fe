import SearchParams from '../../utils/SearchParams.ts';
import { type IPagingFilter, PagingFilter } from './Paging.ts';

export interface INameFilter extends IPagingFilter {
  name?: string;
}

export class NameFilter extends PagingFilter implements INameFilter {

  name?: string;

  updateName(name: string) {
    if (name) {
      this.name = name;
    } else {
      this.name = undefined;
    }
  }

  toSearchParams(): SearchParams {
    return new SearchParams()
      .add('name', this.name)
      .add('page', this.page)
      .add('limit', this.limit);
  }

}

export interface IMultipleNameFilter extends IPagingFilter {
  czechName?: string;
  originalName?: string;
}

export class MultipleNameFilter extends PagingFilter implements IMultipleNameFilter {

  czechName?: string;
  originalName?: string;

  updateCzechName(czechName: string) {
    if (czechName) {
      this.czechName = czechName;
    } else {
      this.czechName = undefined;
    }
  }

  updateOriginalName(originalName: string) {
    if (originalName) {
      this.originalName = originalName;
    } else {
      this.originalName = undefined;
    }
  }

  toSearchParams(): SearchParams {
    return new SearchParams()
      .add('czechName', this.czechName)
      .add('originalName', this.originalName)
      .add('page', this.page)
      .add('limit', this.limit);
  }

}

export interface IAuthorFilter extends IPagingFilter {
  firstName?: string;
  middleName?: string;
  lastName?: string;
}

export class AuthorFilter extends PagingFilter implements IAuthorFilter {

  firstName?: string;
  middleName?: string;
  lastName?: string;

  updateFirstName(firstName: string) {
    if (firstName) {
      this.firstName = firstName;
    } else {
      this.firstName = undefined;
    }
  }

  updateMiddleName(middleName: string) {
    if (middleName) {
      this.middleName = middleName;
    } else {
      this.middleName = undefined;
    }
  }

  updateLastName(lastName: string) {
    if (lastName) {
      this.lastName = lastName;
    } else {
      this.lastName = undefined;
    }
  }

  toSearchParams(): SearchParams {
    return new SearchParams()
      .add('firstName', this.firstName)
      .add('middleName', this.middleName)
      .add('lastName', this.lastName)
      .add('page', this.page)
      .add('limit', this.limit);
  }

}

export interface IAccountFilter extends IPagingFilter {
  username?: string;
  usernameOperation?: string;
}

export class AccountFilter extends PagingFilter implements IAccountFilter {

  username?: string;
  usernameOperation?: string;

  updateUsername(username: string) {
    if (username) {
      this.username = username;
      this.usernameOperation = 'LIKE';
    } else {
      this.username = undefined;
      this.usernameOperation = undefined;
    }
  }

  toSearchParams(): SearchParams {
    return new SearchParams()
      .add('username', this.username)
      .add('usernameOperation', this.usernameOperation)
      .add('page', this.page)
      .add('limit', this.limit);
  }

}
