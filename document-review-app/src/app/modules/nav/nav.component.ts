import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {PatientChangeService} from "../../service/patient-change.service";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private authService: AuthService,
              public patientChange : PatientChangeService,
              private router : Router) {

  }

  title="FHIR Document Viewer";

  patient : fhir.Patient;

  ngOnInit() {
  }
  logout () {
    return this.authService.logout();
  }

  isLoggedIn(){
    return this.authService.isLoggedIn()
  }
  hasPatient() : boolean {
    if (this.patientChange.messages != undefined) {
      this.patient = this.patientChange.messages;
    }
    return false;
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
