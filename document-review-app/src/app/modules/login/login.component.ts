import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../service/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FhirService} from "../../service/fhir.service";
import {PatientEprService} from "../../service/patient-epr.service";

import {KeycloakService} from "../../service/keycloak.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = {
    email: '',
    password: ''
  };

  errorMessage : string;

  logonRedirect : string = undefined;

  subscription: any;

  jwt : any = undefined;

  constructor(private authService: AuthService,
              private router: Router,
              private  fhirService : FhirService,
              private patientMessage : PatientEprService

              ,private activatedRoute: ActivatedRoute
              ,public keycloak : KeycloakService
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
    this.keycloak.getToken().then(() => {

        // Set up a redirect for completion of OAuth2 login
        // This should only be called if OAuth2 has not been performed

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


      // Set a call back for the CookieService
      this.authService.getCookieEventEmitter()
          .subscribe(item => {

              if (this.logonRedirect !== undefined) {
                window.location.href =this.logonRedirect;
              } else {
                this.fhirService.authoriseOAuth2();
              }
            }
          );

      this.authService.setCookie();

  }



/*

    if (this._cookieService.get('ccri-token') !== undefined) {

      this.jwt = this._cookieService.get('ccri-token');
      console.log('Cookie Found');
      // Cookie found so no need to logon.
      if (this.logonRedirect !== undefined) {
        window.location.href =this.logonRedirect;
      }
    }

 */

/*
      this.keycloak.getToken().then( ()=> {
        if (this._cookieService.get('ccri-token') !== undefined) {

          this.jwt = this._cookieService.get('ccri-token');
          console.log('Cookie Found');
          // Cookie found so no need to logon.
          if (this.logonRedirect !== undefined) {
            window.location.href =this.logonRedirect;
          }
        }
        this.subscription = this.fhirService.getOAuthChangeEmitter()
          .subscribe(item => {
            console.log("The Call back ran");
            this.router.navigate(['home']);
          });


                /* If full client called then perform logout. May need to revisit
        if (this.router.url.indexOf('/login') === -1) {
          this.authService.logout();
          this.patientMessage.clear();
        }
        */
/*
      } );
*/




    /*
    if (this._cookieService.get('ccri-token') !== undefined) {

      this.jwt = this._cookieService.get('ccri-token');
      console.log('Cookie Found');
      // Cookie found so no need to logon.
      if (this.logonRedirect !== undefined) {
        window.location.href =this.logonRedirect;
      }
    }
    this.subscription = this.fhirService.getOAuthChangeEmitter()
      .subscribe(item => {
        console.log("The Call back ran");
        this.router.navigate(['home']);
      });
*/
    /* If full client called then perform logout. May need to revisit
if (this.router.url.indexOf('/login') === -1) {
this.authService.logout();
this.patientMessage.clear();
}
*/


/*
signInWithTwitter(content) {
this.errorMessage = "";
this.authService.signInWithTwitter()
.then((user : firebase.User) => {
this.oauth2token(user);
})
.catch((err) => {
console.log(err);
this.errorMessage = err.message;
this.showError(content);
});
}


signInWithFacebook(content) {
this.errorMessage = "";
this.authService.signInWithFacebook()
.then((user : firebase.User) => {
this.oauth2token(user);
})
.catch((err) => {
console.log(err);
this.errorMessage = err.message;
this.showError(content);
});
}

signInWithGoogle(content) {
this.errorMessage = "";
this.authService.signInWithGoogle()
.then((user : firebase.User) => {
this.performLogins(user);
})
.catch((err) => {
console.log(err);
this.errorMessage = err.message;
this.showError(content);
});
}

signInWithGithub(content) {
this.errorMessage = "";
this.authService.signInWithGithub()
.then((user : firebase.User) => {
this.performLogins(user);
})
.catch((err) => {
console.log(err);
this.errorMessage = err.message;
this.showError(content);
});
}

signUpWithEmail(content) {
this.errorMessage = "";
this.authService.createRegular(this.user.email, this.user.password)
.then( (user : firebase.User) => {
//let user = this.authService.getUser();
user.sendEmailVerification();
this.errorMessage = "An email has been sent to "+ user.email +". Please use the link in the email to verify your email address.";
this.showError(content);
// TODO add email has been sent
})
.catch((err) => {
console.log('No user account or error: ' + err);
this.errorMessage = err.message;
this.showError(content);
});
}

signInWithEmail(content) {
this.errorMessage = "";
this.authService.signInRegular(this.user.email, this.user.password)
.then((user : firebase.User) => {
console.log(user);

if (user.emailVerified ) {
this.performLogins(user);
} else {
console.log("Email not verified");
this.errorMessage = "Email not verified";
this.showError(content);
}
})
.catch((err) => {
console.log('No user account or error: ' + err);
this.errorMessage = err.message;
this.showError(content);
});
}
*/






}
