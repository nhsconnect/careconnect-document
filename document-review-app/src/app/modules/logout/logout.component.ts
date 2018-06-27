import { Component, OnInit } from '@angular/core';

import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../service/auth.service";
import {KeycloakService} from "../../service/keycloak.service";
import {environment} from "../../../environments/environment";
import {CookieService} from "ngx-cookie";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  logoutRedirect : string = "";

  constructor(
      private authService: AuthService
      ,private activatedRoute: ActivatedRoute
      ,private router: Router
      ,private _cookieService:CookieService
      ,private keycloak : KeycloakService
  ) { }

  ngOnInit(
  ) {
    this.logoutRedirect = this.activatedRoute.snapshot.queryParams['afterLogout'];
    if (this.logoutRedirect === undefined) {
      console.log(environment.keycloak.authServerUrl+'/realms/'+ environment.keycloak.realm+'/protocol/openid-connect/logout?redirect_uri='
      + document.baseURI);
      this.logoutRedirect = environment.keycloak.authServerUrl+'/realms/'+ environment.keycloak.realm+'/protocol/openid-connect/logout?redirect_uri='
        + document.baseURI;
    }
    this._cookieService.remove('ccri-token');

    localStorage.removeItem('access_token');

    this.keycloak.logout();

    this.authService.setLocalUser(undefined);

    if (this.logoutRedirect !== undefined) {
      window.location.href = this.logoutRedirect;
    }



  }

}
