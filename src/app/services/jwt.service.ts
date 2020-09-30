import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';

@Injectable()
export class JWTService {
  constructor(private auth: AuthService) {}

  /**
   * Checks to see if they have a valid auth token
   * @returns {boolean}
   */
  checkToken(): string {
    if (this.auth.getToken()) {
      return this.auth.getToken();
    } else {
      return '';
    }
  }
}