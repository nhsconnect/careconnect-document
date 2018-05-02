import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';
import * as firebase from 'firebase/app';
import {Permission} from "../model/permission";
import {DatabaseService} from "./database.service";

@Injectable()
export class AuthService {
  private user: Observable<firebase.User>;
  public userDetails: firebase.User = null;

  public permission : Permission = null;

  constructor(private _firebaseAuth: AngularFireAuth
              , private router: Router
              , private databaseService : DatabaseService) {
    this.user = _firebaseAuth.authState;

    this.user.subscribe(
      (user) => {
        if (user) {
          this.userDetails = user;
          console.log("Logged ON *** get permissions");
          console.log(this.userDetails);
          this.getPermission();
        }
        else {
          this.userDetails = null;
        }
      }
    );
  }

  getPermission() : boolean {



    this.databaseService.getPermission(this.getuserInfo().uid).then(perm => {
      if (perm.user == undefined) {
        console.log(' Undef permission ');
        let permission : Permission = new Permission();
        permission.admin = false;
        permission.hacker = false;
        permission.user = true;
        this.databaseService.setPermission(this.getuserInfo().uid,permission);
      } else {
        console.log('Permission '+perm.user);
      }
      this.permission = perm;

    },
      () => {
       console.log(' Rejected ');
      }
      );
    return true;
  }

  getuserInfo() {
    console.log('user '+this.user);
    console.log('user '+this.userDetails);
    return this.userDetails;
  }
  signInWithTwitter() {
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.TwitterAuthProvider()
    )
  }

  signInWithFacebook() {
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.FacebookAuthProvider()
    )
  }

  signInWithGoogle() {
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    )
  }

  signInWithGithub() {
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GithubAuthProvider()
    )
  }

  signInRegular(email, password) {
    //const credential = firebase.auth.EmailAuthProvider.credential( email, password );
    return this._firebaseAuth.auth.signInWithEmailAndPassword(email,password);

  }
  createRegular (email, password) {
    return this._firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
  }



  isLoggedIn() {
    if (this.userDetails == null ) {
      return false;
    } else {
      return true;
    }
  }


  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem("PatientBanner");
    this._firebaseAuth.auth.signOut()
      .then((res) => this.router.navigate(['/']));
  }

}
