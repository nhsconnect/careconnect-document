import {CanActivate, Router} from "@angular/router";
import {AuthService} from "./auth.service";
import {Injectable} from "@angular/core";
import {KeycloakService} from "./keycloak.service";

@Injectable()
export class AuthGuard  implements CanActivate {


  constructor(public authService: AuthService, private keyCloakservice : KeycloakService) {

  }
  canActivate() {

    if (KeycloakService.auth !== undefined && KeycloakService.auth.authz != undefined) {
      console.log("Auth Guard " + KeycloakService.auth.authz.authenticated);
      return KeycloakService.auth.authz.authenticated;
    }
    return false;
  }
  /*
    if (this.authService.getPermission() != undefined ) {
        console.log("AlwaysAuthGuard + Access token = ");
        if (localStorage.getItem("access_token") !=undefined) {

          return true;
        }
        else {
          return false;
        }
    } else {
      console.log("AlwaysAuthGuard - No permission");
      return false;
    }
  }
  */
}
