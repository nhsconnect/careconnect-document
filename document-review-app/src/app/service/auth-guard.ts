import {CanActivate, Router} from "@angular/router";
import {AuthService} from "./auth.service";
import {Injectable} from "@angular/core";
import {KeycloakService} from "./keycloak.service";

@Injectable()
export class AuthGuard  implements CanActivate {


  constructor(public authService: AuthService, private keyCloakservice : KeycloakService) {

  }
  canActivate() {

    if (this.authService.getCookie() !== undefined) {
      // no need to process keycloak, cookie present
      return true;
    }
    if (this.authService.getAccessToken() !== undefined) {
      return true;
    }
    if (KeycloakService.auth !== undefined) {
      if (KeycloakService.auth.authz != undefined) {
        console.log("Auth Guard " + KeycloakService.auth.authz.authenticated);
        return KeycloakService.auth.authz.authenticated;
      } else {
        console.log('Keycloak defined but auth is not - Unable to activate route');
        return false;
      }
    }
    console.log('Unable to activate route' );
    return false;
  }

}
