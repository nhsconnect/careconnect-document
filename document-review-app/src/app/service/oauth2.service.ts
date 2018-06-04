import { Injectable } from '@angular/core';
import {tokenNotExpired} from "angular2-jwt";

@Injectable()
export class Oauth2Service {

  public getToken(): string {
    return localStorage.getItem('access_token');
  }
  public isAuthenticated(): boolean {
    // get the token
    const token = this.getToken();
    // return a boolean reflecting
    // whether or not the token is expired
    return tokenNotExpired(null, token);
  }

}
