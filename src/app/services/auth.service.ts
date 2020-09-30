import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

interface AuthUser {
  id: number;
  email: string;
  fname: string;
  lname: string;
}

interface JwtPayload extends AuthUser {
  exp: number;
  iat: number;
}

@Injectable()
export class AuthService {
  public token: string = null;
  public refresh: string = null;
  public expires: number = 0;
  public user: AuthUser = null;

  protected readonly tokenKey: string = '';
  protected readonly expiresKey: string = '';
  protected readonly refreshKey: string = '';
  protected readonly userKey: string = '';
  protected readonly badgeKey: string = '';

  constructor(public readonly router: Router) {
  }

  loggedIn(): boolean {
    if (this.getToken() && this.getUser()) {
      return true;
    } else {
      return false;
    }
  }

  setToken(token: string): void {
    try {
      localStorage.setItem(this.tokenKey, token);
      this.token = token;
    } catch (err) {
      this.defaultErrorHandler(err);
    }
  }

  getToken(): string {
    try {
      if (localStorage.getItem(this.tokenKey) && localStorage.getItem(this.tokenKey) !== '') {
        const expires = Number(localStorage.getItem(this.expiresKey));
        const seconds = Math.floor(new Date().getTime() / 1000);

        if (seconds >= expires) {
          this.router.navigate(['/Logout']);
          this.logout();
        } else {
          this.setToken(localStorage.getItem(this.tokenKey));
        }
      } else {
        return '';
      }
    } catch (err) {
      this.defaultErrorHandler(err);
    }

    return this.token;
  }

  setRefresh(refresh: string): void {
    try {
      localStorage.setItem(this.refreshKey, refresh);
      this.refresh = refresh;
    } catch (err) {
      this.defaultErrorHandler(err);
    }
  }

  getRefresh(): string {
    try {
      if (localStorage.getItem(this.refreshKey) && localStorage.getItem(this.refreshKey) !== '') {
        this.setRefresh(localStorage.getItem(this.refreshKey));
      }
    } catch (err) {
      this.defaultErrorHandler(err);
    }

    return this.refresh;
  }

  setExpires(expires: number): void {
    try {
      localStorage.setItem(this.expiresKey, String(expires));
      this.expires = expires;
    } catch (err) {
      this.defaultErrorHandler(err);
    }
  }

  getExpires(): number {
    try {
      if (localStorage.getItem(this.expiresKey) && localStorage.getItem(this.expiresKey) !== '') {
        this.setExpires(Number(localStorage.getItem(this.expiresKey)));
      }
    } catch (err) {
      this.defaultErrorHandler(err);
    }

    return this.expires;
  }

  setUser(user: AuthUser): void {
    try {
      localStorage.setItem(this.userKey, JSON.stringify(user));

      this.user = user;
    } catch (err) {
      this.defaultErrorHandler(err);
    }
  }

  getUser(): AuthUser {
    try {
      if (localStorage.getItem(this.userKey)) {
        this.user = JSON.parse(localStorage.getItem(this.userKey));
      }
    } catch (err) {
      this.defaultErrorHandler(err);
    }

    return this.user;
  }

  parseTokenAndSetState(token: string): void {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload: JwtPayload = JSON.parse(
      decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      )
    );

    this.setToken(token);
    this.setExpires(payload.exp);
    this.setUser({
      id: payload.id,
      fname: payload.fname,
      lname: payload.lname,
      email: payload.email
    });
  }

  logout() {
    this.setToken(null);
    this.setRefresh(null);
    this.setExpires(null);
    this.setUser(null);
  }

  defaultErrorHandler(err: Error): void {
    throw err;
  }
}
