import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";

declare let Keycloak: any;

@Injectable()
export class KeycloakService {

  /*

  https://symbiotics.co.za/integrating-keycloak-with-an-angular-4-web-application/

   */

  static auth: any = {};

  static init(): Promise<any> {
    //let keycloakAuth: any = new Keycloak('keycloak.json');
    const keycloakAuth: any = Keycloak({
      url: environment.keycloakRootUrl,
      realm: 'fhir',
      clientId: 'ccri',
      'ssl-required': 'external',
      'public-client': true
    });


    KeycloakService.auth.loggedIn = false;

    return new Promise((resolve, reject) => {
      keycloakAuth.init({onLoad: 'login-required'})
        .success(() => {
          console.log(keycloakAuth);
          KeycloakService.auth.loggedIn = true;
          KeycloakService.auth.authz = keycloakAuth;
          KeycloakService.auth.logoutUrl = keycloakAuth.authServerUrl
            + '/realms/fhir/protocol/openid-connect/logout?redirect_uri='
            + document.baseURI;
          resolve();
        })
        .error(() => {
          reject();
        });
    });
  }

  logout() {
    console.log('*** LOGOUT');
    KeycloakService.auth.loggedIn = false;
    KeycloakService.auth.authz = null;

    window.location.href = KeycloakService.auth.logoutUrl;
  }

  public getUsername(): string {
    return KeycloakService.auth.authz.tokenParsed.preferred_username;
  }

  static getFullName(): string {
    return KeycloakService.auth.authz.tokenParsed.name;
  }

  getToken(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (KeycloakService.auth.authz.token) {
        KeycloakService.auth.authz
          .updateToken(5)
          .success(() => {
            resolve(<string>KeycloakService.auth.authz.token);
          })
          .error(() => {
            reject('Failed to refresh token');
          });
      } else {
        reject('Not logged in');
      }
    });
  }
}
