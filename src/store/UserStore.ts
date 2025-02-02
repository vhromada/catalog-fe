import accountConnector from '../connector/AccountConnector.ts';
import { ChangeRoles, Credentials, type IAccount } from '../model/Account.ts';
import { Result } from '../model/common/Result.ts';

export class UserStore {

  public async login(credentials: Credentials): Promise<Result<IAccount>> {
    this.logout();
    const response = await accountConnector.checkCredentials(credentials);
    if (response.isOk()) {
      sessionStorage.setItem('user', JSON.stringify(response.data!));
    }
    return response;
  }

  public async updateUser(credentials: Credentials): Promise<Result<IAccount>> {
    const response = await accountConnector.updateCredentials(this.getUser()!.uuid, credentials);
    if (response.isOk()) {
      sessionStorage.setItem('user', JSON.stringify(response.data!));
    }
    return response;
  }

  public async updateRoles(uuid: string, roles: ChangeRoles): Promise<Result<IAccount>> {
    const response = await accountConnector.updateRoles(uuid, roles);
    if (response.isOk() && uuid == this.getUser()?.uuid) {
      sessionStorage.setItem('user', JSON.stringify(response.data!));
    }
    return response;
  }

  public getUser(): IAccount | undefined {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : undefined;
  }

  public isLoggedIn(): boolean {
    return this.getUser() !== undefined;
  }

  public isAdmin(): boolean {
    const user = this.getUser();
    return user !== undefined && this.hasRole(user, 'ROLE_ADMIN');
  }

  public isUser(): boolean {
    const user = this.getUser();
    return user !== undefined && this.hasRole(user, 'ROLE_USER');
  }

  public logout() {
    sessionStorage.removeItem('user');
  }

  private hasRole(user: IAccount, role: string): boolean {
    return user?.roles !== undefined && user.roles.indexOf(role) >= 0;
  }

}

export const userStore = new UserStore();
