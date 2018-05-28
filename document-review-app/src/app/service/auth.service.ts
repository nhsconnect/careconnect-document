import {EventEmitter, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';
import * as firebase from 'firebase/app';
import {AngularFireDatabase} from "angularfire2/database";
import {Permission} from "../model/permission";




@Injectable()
export class AuthService {
  set permission(value: Permission) {
    this._permission = value;
  }

  private user: Observable<firebase.User>;

  public userDetails: firebase.User = null;

  private semaphore : boolean = false;

  private _permission :Permission = undefined;

  private permissionEvent : EventEmitter<Permission> = new EventEmitter();

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
          console.log(user);
          this.userDetails = user;
          this.semaphore = false;
        }
        else {
          this.userDetails = null;
        }
      }
    );
  }

  setDbPermission(permission : Permission) {

    if (permission !==undefined) {
      if (permission.cat_access_token !== localStorage.getItem("access_token")) {
        permission.cat_access_token = localStorage.getItem("access_token");
      }
    }
    console.log("SetDbPermissions = "+this.userDetails);
    if (this.userDetails !== undefined && permission !== undefined ) {
      console.log("Updating permissions");
      this.db.object('/permission/' + this.userDetails.uid).update(permission).then(() => {

        console.log('Recorded new permission in database ');
       // if (permission.cat_access_token != undefined) console.log(permission.cat_access_token);
        //this.setLocalPermission(permission);
      });
    }

  }
  setLocalPermission(permission : Permission) {
    this._permission = permission;
    this.permissionEvent.emit(this._permission);
  }

  getPermission() : Permission {
    return this._permission;
  }

  getPermissionEventEmitter() {
    return this.permissionEvent;
  }

  getIdToken() {
    return this._firebaseAuth.idToken;
  }

  verifyUserProfileInfo() {
    this._firebaseAuth.authState.subscribe(
      (user) => {
        if (user !== null) {
          this.db.object('users/' + user.uid).set({
            displayName: user.displayName,
            email: user.email,
            uid: user.uid,
          });

          this.db.database.ref('/permission/' + user.uid).once('value').then(action => {

            //console.log(action.payload.val());
            if (action.val() != undefined && action.val() != null) {
              this.setLocalPermission(action.val());
            } else {
              console.log('Not found existing permission. Adding basic permission ' + user.uid);

              let basicPermission = new Permission();
              if (user.displayName != undefined) {
                basicPermission.userName = user.displayName;
              } else {
                basicPermission.userName = user.uid;
              }
              basicPermission.cat_access_token = localStorage.getItem("access_token");
              this.setDbPermission(basicPermission);
              this.setLocalPermission(basicPermission);

            }

          });

        }

      }
    );
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
      this.setLocalPermission(undefined);
      this.auth = false;
      localStorage.removeItem('access_token');


        console.log('Main Logout');
       // this.removeSub();

        this.fireBaseLogout();

      // }
    }
  }

}
