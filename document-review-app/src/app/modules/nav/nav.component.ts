import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private authService: AuthService,

              private router : Router) { }

  title="FHIR Document Viewer";

  ngOnInit() {
  }
  logout () {
    return this.authService.logout();
  }

  isLoggedIn(){
    return this.authService.isLoggedIn()
  }

  hasAuthorised() : boolean {
    if (localStorage.getItem('access_token') != undefined && localStorage.getItem('access_token') != null) return true;
    return false;
  }
  getType() : string {
    if (localStorage.getItem('access_type') != undefined) return localStorage.getItem('access_type');
    return "";
  }
  deAuthorise() : void {
    localStorage.removeItem('access_token');
    localStorage.removeItem("PatientBanner");
  }
  Authorise() : void {
    this.router.navigate(['authorise']);
  }

}