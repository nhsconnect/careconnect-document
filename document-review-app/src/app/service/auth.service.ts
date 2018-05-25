import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';
import * as firebase from 'firebase/app';
import {AngularFireDatabase} from "angularfire2/database";
import {Permission} from "../model/permission";
import {AngularFireObject} from "angularfire2/database/interfaces";



@Injectable()
export class AuthService {

  private user: Observable<firebase.User>;

  public userDetails: firebase.User = null;

  private semaphore : boolean = false;

  public permission :Permission = undefined;

//  permSub : AngularFireObject<Permission> = undefined;

  public auth : boolean = false;

  constructor(public _firebaseAuth: AngularFireAuth
              , private router: Router
              , public db : AngularFireDatabase
              ) {
    this.user = _firebaseAuth.authState;


      // copy profile info to database for a richer and more accessible user profile database

    this.verifyUserProfileInfo();

    this.user.subscribe(
      (user) => {
        if (user) {
          this.userDetails = user;


          console.log('Subscribing on permission '+user.uid);
          this.semaphore = false;
          this.db.database.ref('/permission/'+user.uid).once('value').then( action => {

            //console.log(action.payload.val());
            if (action.val() != undefined && action.val()!=null) {
              this.permission = action.val();
            } else {
              console.log('Not found existing permission. Adding basic permission ' + user.uid);

              let basicPermission = new Permission();
              if (user.displayName != undefined) {
                basicPermission.userName = user.displayName;
              } else {
                basicPermission.userName = user.uid;
              }
              this.permission = basicPermission;

              this.db.database.ref('/permission/' + user.uid).set(basicPermission).then(() => {

                console.log('Recorded new permission in database');
              });

            }
          });

        }
        else {
          this.userDetails = null;
        }
      }
    );
  }

  getIdToken() {
    return this._firebaseAuth.idToken;
  }

  verifyUserProfileInfo() {
    let user = this._firebaseAuth.authState.subscribe(
      (user) => {
        if (user !== null) {
          this.db.object('users/' + user.uid).set({
            displayName: user.displayName,
            email: user.email,
            uid: user.uid,
          });
        }
      }
    );
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
   return this._firebaseAuth.auth.createUserWithEmailAndPassword(email, password );
  }



  isLoggedIn() {
    if (this.userDetails == null || !this.auth) {
      return false;
    } else {

      return true;
    }
  }

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
  logout() {
    if (!this.semaphore) {
      this.semaphore = true;
      this.permission = undefined;
      this.auth = false;
      localStorage.removeItem('access_token');
      localStorage.removeItem("PatientBanner");

        console.log('Main Logout');
       // this.removeSub();

        this.fireBaseLogout();

      // }
    }
  }

}
