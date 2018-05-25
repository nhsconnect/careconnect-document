import { Component, OnInit } from '@angular/core';
import {CookieService} from "angular2-cookie/core";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  logoutRedirect : string = "";

  constructor( private authService: AuthService
    ,private activatedRoute: ActivatedRoute
    ,private router: Router
    ,private _cookieService:CookieService
  ) { }

  ngOnInit(
  ) {
    this.logoutRedirect = this.activatedRoute.snapshot.queryParams['afterLogout'];
    this._cookieService.remove('ccri-token');

    localStorage.removeItem('access_token');


    this.authService.permission = undefined;

    this.authService._firebaseAuth.auth.signOut().then((res) => {
      if (this.logoutRedirect !=undefined) {
        window.location.href =this.logoutRedirect;
      } else {
        this.router.navigate(['/']);
      }

    });





  }

}
