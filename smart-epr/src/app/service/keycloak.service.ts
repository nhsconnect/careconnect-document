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

    const keycloakAuth: any = Keycloak({
      url: this.getKeycloakRootUrl(),
      authServerUrl: this.getKeycloakServerUrl(),

      realm: this.getKeycloakRealm(),
      clientId: this.getKeycloakClientId(),

      credentials : {
        secret : this.getClientSecret(),
      },
      'ssl-required': 'external',
      'public-client': true
    });


    KeycloakService.auth.loggedIn = false;

    return new Promise((resolve, reject) => {
      keycloakAuth.init({onLoad: 'login-required'})
        .success(() => {

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
  }

  static getUsername(): string {
    return KeycloakService.auth.authz.tokenParsed.preferred_username;
  }

  static getUserEmail(): string {
    return KeycloakService.auth.authz.tokenParsed.resource_access.toString();
  }

  static getClientSecret() {
    // This is a marker for entryPoint.sh to replace
     let secret :string = 'KEYCLOAK_CLIENT_SECRET';
     if (secret.indexOf('SECRET') != -1) secret = environment.keycloak.client_secret;
     return secret;
  }

  static getKeycloakRootUrl() {
    let rootUrl :string = 'KEYCLOAK_ROOT_URL';
    if (rootUrl.indexOf('KEYCLOAK') != -1) rootUrl = environment.keycloak.RootUrl;
    return rootUrl;
  }
  static getKeycloakServerUrl() {
    let rootUrl :string = 'KEYCLOAK_SERVER_URL';
    if (rootUrl.indexOf('KEYCLOAK') != -1) rootUrl = environment.keycloak.authServerUrl;
    return rootUrl;
  }
  static getKeycloakRealm() {
    let realm :string = 'KEYCLOAK_REALM';
    if (realm.indexOf('KEYCLOAK') != -1) realm= environment.keycloak.realm;
    return realm;
  }
  static getKeycloakClientId() {
    let clienId :string = 'KEYCLOAK_CLIENT_ID';
    if (clienId.indexOf('KEYCLOAK') != -1) clienId= environment.keycloak.client_id;
    return clienId;
  }

  static getFullName(): string {
    return KeycloakService.auth.authz.tokenParsed.name;
  }

  getToken(): Promise<string> {
    return new Promise<string>((resolve, reject) => {

      /*
      if (KeycloakService.auth.authz === undefined) {
        console.log('Missing auth, attempting to retrieve from localStorage');
            KeycloakService.auth.authz = localStorage.getItem("keycloak.auth");
            console.log(localStorage.getItem("keycloak.auth"));
      }
      */

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
