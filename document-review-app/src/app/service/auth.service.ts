import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';
import * as firebase from 'firebase/app';
import {AngularFireDatabase} from "angularfire2/database";
import {Permission} from "../model/permission";
import {AngularFireObject} from "angularfire2/database/interfaces";
import {T} from "@angular/core/src/render3";


@Injectable()
export class AuthService {
  private user: Observable<firebase.User>;
  public userDetails: firebase.User = null;

  private semaphore : boolean = false;

  public permission :Permission = undefined;

  permSub : AngularFireObject<Permission> = undefined;

  constructor(private _firebaseAuth: AngularFireAuth
              , private router: Router
              , public db : AngularFireDatabase
              ) {
    this.user = _firebaseAuth.authState;

    this.user.subscribe(
      (user) => {
        if (user) {
          this.userDetails = user;
          console.log('adding permission subscription');
          this.semaphore = false;
          this.permSub = this.db.object('/permission/'+user.uid);
          this.permSub.snapshotChanges().subscribe(action => {
            console.log(action.type);
            console.log(action.key);
            console.log(action.payload.val());
            if (action.payload.val() != undefined) {
              this.permission = action.payload.val();
            }
          });

        }
        else {
          this.userDetails = null;
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
    return this._firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
  }



  isLoggedIn() {
    if (this.userDetails == null ) {
      return false;
    } else {

      return true;
    }
  }

  removeSub() {
    if (this.permSub != undefined && this.userDetails != undefined) {
      console.log('Calling unsubscribe');
      this.permSub.snapshotChanges().subscribe().unsubscribe();
      //this.permSub.remove(); Don't try this, it performs a delete.
    }
    if (this.user != undefined) {
      this.user.subscribe().unsubscribe();
    }
  }

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
      localStorage.removeItem('access_token');
      localStorage.removeItem("PatientBanner");
      if (this.permission == undefined && this.userDetails != null) {
        this.removeSub();
        console.log('Adding basic permission ' + this.userDetails.uid);
        const itemRef = this.db.object('/permission/' + this.userDetails.uid);
        let basicPermission = new Permission();
       // basicPermission.user = true;
        basicPermission.userName = this.userDetails.displayName;
        itemRef.set(basicPermission).then(() => {

          this.fireBaseLogout();
        });
      } else {
        console.log('Second Logout');
        this.removeSub();

        this.fireBaseLogout();

      }
    }
  }

}
