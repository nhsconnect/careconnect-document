import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../service/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FhirService} from "../../service/fhir.service";
import {EprService} from "../../service/epr.service";

import {KeycloakService} from "../../service/keycloak.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  logonRedirect : string = undefined;

  subscription: any;

  jwt : any = undefined;

  constructor(private authService: AuthService,
              private router: Router,
              private  fhirService: FhirService,
              private eprService : EprService

              ,private activatedRoute: ActivatedRoute
              ,public keycloakService : KeycloakService
    ) {
  }

  // https://symbiotics.co.za/integrating-keycloak-with-an-angular-4-web-application/


  ngOnInit() {

      this.logonRedirect = this.activatedRoute.snapshot.queryParams['afterAuth'];

      KeycloakService.init()
        .then(() => {

          this.onKeyCloakComplete();
        })
        .catch(e => console.log('rejected'));


  }

  onKeyCloakComplete() {
    // Check logged in or login
    this.keycloakService.getToken().then(() => {

        // Set up a redirect for completion of OAuth2 login
        // This should only be called if OAuth2 has not been performed

      this.eprService.userName = KeycloakService.getUsername();
      this.eprService.userEmail = KeycloakService.getUserEmail();

          this.subscription = this.fhirService.getOAuthChangeEmitter()
            .subscribe(item => {
              console.log("The Call back ran");
              this.router.navigate(['ping']);
            });
          this.performLogins();

      }
    );
  }

  performLogins() :void {

    //console.log('Perform logins');

      // Set a call back for the CookieService
      this.keycloakService.getCookieEventEmitter()
          .subscribe(item => {
             // console.log('Cookie event '+this.logonRedirect);
              if (this.logonRedirect !== undefined) {
                window.location.href =this.logonRedirect;
              } else {
                this.fhirService.authoriseOAuth2();
              }
            }
          );

      this.keycloakService.setCookie();

  }




}
