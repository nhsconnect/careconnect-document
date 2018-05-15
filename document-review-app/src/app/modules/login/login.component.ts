import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../service/auth.service';
import {Router} from '@angular/router';
import {FhirService} from "../../service/fhir.service";
import {Oauth2token} from "../../model/oauth2token";
import {PatientEprService} from "../../service/patient-epr.service";
import * as firebase from "firebase";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

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

  constructor(private authService: AuthService,
              private router: Router,
              private  fhirService : FhirService,
              private patientMessage : PatientEprService
              ,private modalService: NgbModal) {
  }


  signInWithTwitter(content) {
    this.errorMessage = "";
    this.authService.signInWithTwitter()
      .then((res) => {
        this.oauth2token();
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
      .then((res) => {
        this.oauth2token();
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
        .then((res) => {
          this.oauth2token();
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
      .then((res) => {
         this.oauth2token();
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
          this.oauth2token();
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



  ngOnInit() {
    this.authService.logout();
    this.patientMessage.clear();
  }

  oauth2token() :void {


      this.fhirService.authoriseOAuth2('ed73b2cb-abd0-4f75-b9a2-5f9c0535b82c','QOm0VcqJqa9stA1R0MJzHjCN_uYdo0PkY8OT68UCk2XDFxFrAUjajuqOvIom5dISjKshx2YiU51mXtx7W5UOwQ').subscribe( response => {
        console.log(response);
        this.smartToken =  response;
        this.authService.auth = true;
        localStorage.setItem("access_token",this.smartToken.access_token);

          this.router.navigate(['home']);
      },
      ()=> {},
      () => {

      }
    );


  }

  showError(content ) {

    this.modalService.open(content,{ windowClass: 'dark-modal' });
  }

}
