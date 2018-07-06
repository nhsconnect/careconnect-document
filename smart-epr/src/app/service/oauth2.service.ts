import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable()
export class Oauth2Service {

  public getToken(): string {
    return localStorage.getItem('access_token');
  }
  public isAuthenticated(): boolean {
    // get the token
    const token = this.getToken();
    const helper = new JwtHelperService();
    // return a boolean reflecting
    // whether or not the token is expired

    return helper.isTokenExpired(token);
  }

  public getUser() : string {
    const token = this.getToken();
    const helper = new JwtHelperService();
    console.log('Token '+token);
    let retStr = helper.decodeToken(token)
    return retStr;
  }

}
