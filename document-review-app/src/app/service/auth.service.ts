import {EventEmitter, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';
import * as firebase from 'firebase/app';
import {AngularFireDatabase} from "angularfire2/database";
import {Permission} from "../model/permission";
import {CookieService} from "angular2-cookie/core";
import {KeycloakService} from "./keycloak.service";




@Injectable()
export class AuthService {
  set permission(value: Permission) {
    this._permission = value;
  }

 // private user: Observable<firebase.User>;

  //public userDetails: firebase.User = null;

  private semaphore : boolean = false;

  private _permission :Permission = undefined;

  private permissionEvent : EventEmitter<Permission> = new EventEmitter();

  private cookieEvent : EventEmitter<any> = new EventEmitter();

  public auth : boolean = false;



  constructor(
             private router: Router

            ,private _cookieService:CookieService
              ) {



    this.updatePermission();

  }


  setLocalPermission(permission : Permission) {
    this._permission = permission;
    this.permissionEvent.emit(this._permission);
  }



  getCookieEventEmitter() {

    return this.cookieEvent;
  }
  setCookie() {

      let jwt: any = KeycloakService.auth.authz.token;


      this._cookieService.put('ccri-token', jwt , {
        domain: 'localhost',
        path: '/',
        expires: new Date((new Date()).getTime() + 3 * 60000)
      });

      this.cookieEvent.emit(jwt);
  }
  getCookie() {

    // This should also include a check for expired cookie, return undefined if it is.
    return this._cookieService.get('ccri-token');
  }


  getPermissionEventEmitter() {
    return this.permissionEvent;
  }

  updatePermission() {


      let basicPermission = new Permission();

      basicPermission.cat_access_token = localStorage.getItem("access_token");

      this.setLocalPermission(basicPermission);
  }

  logout() {
    if (!this.semaphore) {
      this.semaphore = true;
      this.setLocalPermission(undefined);
      this.auth = false;
      localStorage.removeItem('access_token');




    }
  }

  /*
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
   return this._firebaseAuth.auth.createUserWithEmailAndPassword(email, password );
  }



  isLoggedIn() {
    if (this.userDetails == null || !this.auth) {
      return false;
    } else {

      return true;
    }
  }
*/
  /*
  removeSub() {
    if (this.permSub != undefined && this.userDetails != undefined) {
      console.log('Calling unsubscribe');
      this.permSub.snapshotChanges().subscribe().unsubscribe();
    }
    if (this.user != undefined) {
      this.user.subscribe().unsubscribe();
    }
  }
*/

  /*
  fireBaseLogout() {
    console.log('Logging out');
    this.userDetails = undefined;
    this._firebaseAuth.auth.signOut()
      .then((res) => {
       // this.semaphore= false;
        console.log('Finished Signout');
        this.router.navigate(['/']);
      });
  }
  */



}
