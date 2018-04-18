import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../service/auth.service';
import {Router} from '@angular/router';
import {FhirService} from "../../service/fhir.service";
import {Oauth2token} from "../../model/oauth2token";

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

  smartToken : Oauth2token;

  constructor(private authService: AuthService, private router: Router, private  fhirService : FhirService) {
  }


  signInWithTwitter() {
    this.errorMessage = "";
    this.authService.signInWithTwitter()
      .then((res) => {
        this.oauth2token();
      })
      .catch((err) => {
        console.log(err);
        this.errorMessage = err.message;
      });
  }


  signInWithFacebook() {
    this.errorMessage = "";
    this.authService.signInWithFacebook()
      .then((res) => {
        this.oauth2token();
      })
      .catch((err) => {
        console.log(err);
        this.errorMessage = err.message;
      });
  }


    signInWithGoogle() {
      this.errorMessage = "";
      this.authService.signInWithGoogle()
        .then((res) => {
          this.oauth2token();
        })
        .catch((err) => {
          console.log(err);
          this.errorMessage = err.message;
        });
    }

    signInWithGithub() {
      this.errorMessage = "";
    this.authService.signInWithGithub()
      .then((res) => {
         this.oauth2token();
      })
      .catch((err) => {
        console.log(err);
        this.errorMessage = err.message;
      });
  }

  signInWithEmail() {
    this.errorMessage = "";
    this.authService.signInRegular(this.user.email, this.user.password)
      .then((res) => {
        console.log(res);

        this.oauth2token();
      })
      .catch((err) => {
        console.log('No user account or error: ' + err);
        this.errorMessage = err.message;
        this.authService.createRegular(this.user.email, this.user.password)
          .then((res) => {
            console.log(res);

            this.oauth2token();
          })
          .catch((err) => {
            this.errorMessage = err.message;
          })
      });
  }

  ngOnInit() {
    this.authService.logout();
  }

  oauth2token() :void {


      this.fhirService.authorise('ed73b2cb-abd0-4f75-b9a2-5f9c0535b82c','QOm0VcqJqa9stA1R0MJzHjCN_uYdo0PkY8OT68UCk2XDFxFrAUjajuqOvIom5dISjKshx2YiU51mXtx7W5UOwQ').subscribe( response => {
        console.log(response);
        this.smartToken =  response;
        //this.scopes = this.oauth2token.scope.split(' ');
        localStorage.setItem("access_token",this.smartToken.access_token);
       // localStorage.setItem("access_type",this.selectedToken.type);
          this.router.navigate(['home']);
      },
      ()=> {},
      () => {

      }
    );

  }


}
